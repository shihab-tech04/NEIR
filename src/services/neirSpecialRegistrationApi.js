const ENDPOINT='https://wjsdylxbvdnraztktbtg.supabase.co/functions/v1/neir-prototype-special';
export async function neirSpecialApi(action,payload={}){
  let response;
  try{
    response=await fetch(ENDPOINT,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action,...payload}),
    });
  }catch{
    throw new Error('Unable to connect to Special Registration. Please retry.');
  }
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||'Special Registration operation failed.');
  return result;
}
export const listSpecialApplications=()=>neirSpecialApi('admin_list');
export const getSpecialApplication=(id)=>neirSpecialApi('admin_details',{id});
export const updateSpecialApplication=(id,status,remarks='')=>neirSpecialApi('admin_update',{id,status,remarks});
