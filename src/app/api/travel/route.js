import { auth } from '@clerk/nextjs/server';
const cache=new Map();
let nextAt=0;
export async function POST(request){
  if(!(await auth()).userId) return Response.json({error:'Sign in to estimate travel.'},{status:401});
  let points;try{({points}=await request.json());}catch{return Response.json({error:'Invalid route.'},{status:400});}
  if(!Array.isArray(points)||points.length!==2||!points.every(p=>p && Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180)) return Response.json({error:'Choose two valid places.'},{status:400});
  const key=points.map(p=>`${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';');
  const cached=cache.get(key);if(cached && cached.until>Date.now())return Response.json(cached.value);
  const wait=Math.max(0,nextAt-Date.now());if(wait>2000)return Response.json({error:'Travel estimates are busy. Try again shortly.'},{status:429});
  nextAt=Date.now()+wait+1100;if(wait)await new Promise(resolve=>setTimeout(resolve,wait));
  try{
    const response=await fetch(`https://router.project-osrm.org/route/v1/driving/${key}?overview=false`,{signal:AbortSignal.timeout(8000),cache:'no-store'});
    if(!response.ok)throw new Error();const data=await response.json(),route=data.routes?.[0];
    if(data.code!=='Ok'||!Number.isFinite(route?.duration)||!Number.isFinite(route?.distance))throw new Error();
    const value={minutes:Math.max(1,Math.ceil(route.duration/60)),miles:route.distance/1609.344};
    if(cache.size>=500)cache.delete(cache.keys().next().value);cache.set(key,{value,until:Date.now()+3600000});return Response.json(value);
  }catch{return Response.json({error:'No driving estimate available. Check Google Maps for this route.'},{status:503});}
}
