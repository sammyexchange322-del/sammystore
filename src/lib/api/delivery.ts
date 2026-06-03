import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Atomically assign one credential from the product's pool to the given order.
 * Called immediately after a successful purchase_with_wallet RPC.
 * Security: verifies the order exists and was created within the last 10 minutes
 * so a stale orderId cannot be replayed to steal credentials.
 */
export const assignCredentialToOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      orderId: z.string().uuid(),
      productId: z.string().uuid(),
    })
  )
  .handler(async ({ data }) => {
    // 1. Verify the order is real and recent
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, created_at")
      .eq("id", data.orderId)
      .single();

    if (orderErr || !order) throw new Error("Order not found");

    const ageMs = Date.now() - new Date(order.created_at as string).getTime();
    if (ageMs > 10 * 60 * 1000) throw new Error("Order too old for credential assignment");

    // 2. Atomically assign a credential via security-definer function
    const { data: credId, error: assignErr } = await supabaseAdmin.rpc(
      "assign_credential_to_order" as never,
      { _order_id: data.orderId, _product_id: data.productId } as never
    );

    if (assignErr) throw new Error(assignErr.message);

    if (!credId) {
      // Pool is empty — log for admin visibility, return gracefully
      await supabaseAdmin.from("activity_logs").insert({
        actor_id: order.user_id as string,
        action: "credential_out_of_stock",
        target: data.productId,
        metadata: { order_id: data.orderId },
      });
      return { assigned: false, content: null, label: null };
    }

    // 3. Return the credential content so the client can display it immediately
    const { data: cred } = await supabaseAdmin
      .from("product_credentials")
      .select("content, label")
      .eq("id", credId as string)
      .single();

    return {
      assigned: true,
      content: cred?.content ?? null,
      label: cred?.label ?? null,
    };
  });
