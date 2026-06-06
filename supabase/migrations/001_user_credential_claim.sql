-- ============================================================
-- Migration 001 — User-callable credential claim function
-- Allows authenticated users to claim credentials on their
-- own orders without needing the service_role key.
-- ============================================================

-- user_claim_credential:
--   Authenticated users can call this with their own JWT.
--   SECURITY DEFINER so it can bypass RLS to lock the credential row,
--   but it verifies ownership before doing anything.
CREATE OR REPLACE FUNCTION public.user_claim_credential(
  _order_id  uuid,
  _product_id uuid
) RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_order_user_id uuid;
  v_cred_id       uuid;
  v_content       text;
  v_label         text;
  v_existing      text;
BEGIN
  -- Ownership check
  SELECT user_id INTO v_order_user_id FROM public.orders WHERE id = _order_id;
  IF v_order_user_id IS NULL THEN RAISE EXCEPTION 'order not found'; END IF;
  IF v_order_user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'forbidden'; END IF;

  -- Already delivered? Return existing credential.
  SELECT delivered_payload INTO v_existing
    FROM public.order_items
    WHERE order_id = _order_id AND product_id = _product_id
      AND delivered_payload IS NOT NULL
    LIMIT 1;

  IF v_existing IS NOT NULL THEN
    BEGIN
      SELECT content, label INTO v_content, v_label
        FROM public.product_credentials
        WHERE id = v_existing::uuid;
    EXCEPTION WHEN others THEN
      v_content := NULL; v_label := NULL;
    END;
    RETURN jsonb_build_object('assigned', true, 'content', v_content, 'label', v_label);
  END IF;

  -- Claim the next available credential (SKIP LOCKED = no two buyers get same row)
  SELECT id INTO v_cred_id
    FROM public.product_credentials
    WHERE product_id = _product_id AND order_id IS NULL
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

  IF v_cred_id IS NULL THEN
    RETURN jsonb_build_object('assigned', false, 'content', null, 'label', null);
  END IF;

  UPDATE public.product_credentials
    SET order_id     = _order_id,
        assigned_to  = auth.uid(),
        delivered_at = now()
    WHERE id = v_cred_id;

  UPDATE public.order_items
    SET delivered_payload = v_cred_id::text
    WHERE order_id = _order_id AND product_id = _product_id;

  SELECT content, label INTO v_content, v_label
    FROM public.product_credentials WHERE id = v_cred_id;

  RETURN jsonb_build_object('assigned', true, 'content', v_content, 'label', v_label);
END;
$$;

REVOKE ALL ON FUNCTION public.user_claim_credential(uuid, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.user_claim_credential(uuid, uuid) TO authenticated;
