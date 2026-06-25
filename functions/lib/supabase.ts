import { createClient } from '@supabase/supabase-js';
export function getSupabaseAdmin(env:{SUPABASE_URL:string;SUPABASE_SERVICE_ROLE_KEY:string}){
  return createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
}
export function jsonResponse(data:unknown,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
}
export function errorResponse(message:string,status=400){return jsonResponse({error:message},status);}
export async function verifyAuth(request:Request,env:{SUPABASE_URL:string;SUPABASE_SERVICE_ROLE_KEY:string}):Promise<string|null>{
  const h=request.headers.get('Authorization');
  if(!h?.startsWith('Bearer '))return null;
  const{data:{user},error}=await getSupabaseAdmin(env).auth.getUser(h.slice(7));
  if(error||!user)return null;
  return user.id;
}
