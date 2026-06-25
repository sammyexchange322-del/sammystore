import{Env,buildProviders,findBestProvider}from'../../lib/providers/registry';
import{jsonResponse,errorResponse,getSupabaseAdmin}from'../../lib/supabase';
export const onRequestGet:PagesFunction<Env>=async({request,env})=>{
  const url=new URL(request.url);
  const country=url.searchParams.get('country'),service=url.searchParams.get('service');
  if(!country||!service)return errorResponse('Missing country or service');
  const rate=parseFloat(env.EXCHANGE_RATE_USD_NGN??'1650');
  const best=await findBestProvider(buildProviders(env),country,service,rate);
  if(!best)return jsonResponse({available:false,message:'No stock available'});
  const{data:cfg}=await getSupabaseAdmin(env).from('fn_pricing_config').select('margin_percent,fixed_markup_ngn,override_price_ngn').eq('is_active',true).limit(1).maybeSingle();
  let price=best.priceNgn;
  if(cfg?.override_price_ngn)price=cfg.override_price_ngn;
  else price=Math.ceil(best.priceNgn*(1+(cfg?.margin_percent??25)/100)+(cfg?.fixed_markup_ngn??0));
  return jsonResponse({available:true,price_ngn:price,price_usd:best.priceUsd,stock:best.stock,provider_slug:best.provider.slug,estimated_wait_seconds:60});
};
export const onRequestOptions:PagesFunction=async()=>new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type'}});
