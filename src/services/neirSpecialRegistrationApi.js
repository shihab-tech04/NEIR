// Special Registration only. Does not grant privileges based on the portal's mock login.
const ENDPOINT='https://wjsdylxbvdnraztktbtg.supabase.co/functions/v1/neir-special-registration';
export const SPECIAL_REVIEW_SESSION_KEY='neir-special-review-session-v1';
export async function neirSpecialApi(action,payload={}){
  let response;
  try{response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})});}
  catch{throw new Error('Unable to connect to NEIR Special Registration. Retry.');}
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||'Special Registration operation failed.');
  return result;
}
export const signInSpecialReviewer=(username,password)=>neirSpecialApi('reviewer_login',{username,password});
export const listSpecialApplications=(token)=>neirSpecialApi('admin_list',{token});
export const getSpecialApplication=(token,id)=>neirSpecialApi('admin_details',{token,id});
export const updateSpecialApplication=(token,id,status,remarks='')=>neirSpecialApi('admin_update',{token,id,status,remarks});
