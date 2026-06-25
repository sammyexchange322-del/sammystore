import{Env,buildProviders,findBestProvider}from'../../lib/providers/registry';
import{jsonResponse,errorResponse,getSupabaseAdmin,verifyAuth}from'../../lib/supabase';
export const onRequestPost:PagesFunction<Env>=async({request,env})=>{
  const userId=await verifyAuth(request,env);
  if(!userId)return errorResponse('Unauthorized',401);
  const{country_code,service_slug}=await request.json()as{country_code?:string;service_slug?:string};
  if(!country_code||!service_slug)return errorResponse('Missing fields');
  const supabase=getSupabaseAdmin(env);
  const rate=parseFloat(env.EXCHANGE_RATE_USD_NGN??'1650');
  const best=await findBestProvider(buildProviders(env),country_code,service_slug,rate);
  if(!best)return errorResponse('No numbers available',503);
  const{data:cfg}=await supabase.from('fn_pricing_config').select('margin_percent,fixed_markup_ngn,override_price_ngn').eq('is_active',true).limit(1).maybeSingle();
  let price=best.priceNgn;
  if(cfg?.override_price_ngn)price=cfg.override_price_ngn;
  else price=Math.ceil(best.priceNgn*(1+(cfg?.margin_percent??25)/100)+(cfg?.fixed_markup_ngn??0));
  const{data:prov}=await supabase.from('fn_providers').select('id').eq('slug',best.provider.slug).single();
  if(!prov)return errorResponse('Provider not found',500);
  const{data:orderId,error:rpcError}=await supabase.rpc('fn_purchase_number',{p_user_id:userId,p_country_code:country_code,p_service_slug:service_slug,p_amount_ngn:price,p_provider_id:prov.id});
  if(rpcError)return errorResponse(rpcError.message.includes('Insufficient')?'Insufficient wallet balance':'Purchase failed',400);
  let providerOrderId:string,phoneNumber:string;
  try{const r=await best.provider.buyNumber(country_code,service_slug);providerOrderId=r.providerOrderId;phoneNumber=r.phoneNumber;}
  catch{await supabase.rpc('fn_refund_order',{p_order_id:orderId,p_reason:'Auto-refund: Provider failed'});return errorResponse('Provider error. Wallet refunded.',502);}
  const expiresAt=new Date(Date.now()+20*60*1000).toISOString();
  await supabase.from('fn_orders').update({phone_number:phoneNumber,provider_order_id:providerOrderId,status:'active',expires_at:expiresAt}).eq('id',orderId);
  return jsonResponse({order_id:orderId,phone_number:phoneNumber,expires_at:expiresAt,amount_ngn:price});
};
export const onRequestOptions:PagesFunction=async()=>new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type'}});
