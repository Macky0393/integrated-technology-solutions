const http=require("http"),fs=require("fs"),path=require("path"),url=require("url");
const PORT=process.env.PORT||3000, ROOT=path.join(__dirname,"public"), DATA=path.join(__dirname,"data","inquiries.json");
const config={messengerUrl:process.env.MESSENGER_URL||"https://m.me/",mapQuery:process.env.MAP_QUERY||"Philippines"};
function json(res,obj,status=200){res.writeHead(status,{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"});res.end(JSON.stringify(obj))}
function body(req){return new Promise((resolve,reject)=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>{try{resolve(JSON.parse(b||"{}"))}catch(e){reject(e)}})})}
async function ai(message){
 const key=process.env.OPENAI_API_KEY;
 if(!key)return "AI is in demo mode. Please tell me your service, project location and estimated quantity. Our team can follow up through the quotation form.";
 const payload={model:process.env.OPENAI_MODEL||"gpt-5-mini",input:[
  {role:"system",content:[{type:"input_text",text:"You are the customer inquiry assistant for Integrated Technology Solutions in the Philippines. Services: Fiber Optic, Structured Cabling, CCTV Installation, Network Solutions, Testing/Troubleshooting and Maintenance. Be concise, professional and helpful. Collect name, contact number/email, service, project location, quantity/scope and timeline when relevant. Do not promise exact pricing or availability. Encourage the user to submit a quotation request for a formal quote."}]},
  {role:"user",content:[{type:"input_text",text:message}]}
 ]};
 const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify(payload)});
 if(!r.ok)throw new Error("AI request failed");
 const d=await r.json(); return d.output_text||"Please submit a quotation request so our team can assist you.";
}
function saveInquiry(data){let arr=[];try{arr=JSON.parse(fs.readFileSync(DATA,"utf8"))}catch{};data.id=Date.now().toString();data.createdAt=new Date().toISOString();arr.push(data);fs.writeFileSync(DATA,JSON.stringify(arr,null,2));return data}
const mime={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg"};
const server=http.createServer(async(req,res)=>{
 const u=url.parse(req.url,true);
 if(req.method==="GET"&&u.pathname==="/api/config")return json(res,config);
 if(req.method==="POST"&&u.pathname==="/api/chat"){try{const b=await body(req);return json(res,{reply:await ai(String(b.message||""))})}catch(e){return json(res,{reply:"The AI assistant is temporarily unavailable. Please use the quotation form or Messenger."},503)}}
 if(req.method==="POST"&&u.pathname==="/api/inquiries"){try{const b=await body(req);if(!b.name||!b.phone||!b.service||!b.details)return json(res,{message:"Please complete the required fields."},400);saveInquiry(b);return json(res,{message:"Thank you! Your inquiry has been recorded. Our team can now follow up with you."})}catch(e){return json(res,{message:"Unable to save inquiry."},500)}}
 if(req.method==="GET"&&u.pathname==="/admin"){
  const adminToken=process.env.ADMIN_TOKEN;

  if(!adminToken){
    return json(res,{error:"Admin access is not configured."},503);
  }

  if(u.query.token!==adminToken){
    return json(res,{error:"Unauthorized"},401);
  }

  let arr=[];

  try{
    arr=JSON.parse(
      fs.readFileSync(DATA,"utf8")
    );
  }catch(e){
    arr=[];
  }

  return json(res,{
    inquiries:arr
  });
}
 let p=path.normalize(path.join(ROOT,u.pathname==="/"?"index.html":u.pathname));if(!p.startsWith(ROOT))return json(res,{error:"Forbidden"},403);fs.readFile(p,(err,data)=>{if(err)return json(res,{error:"Not found"},404);res.writeHead(200,{"Content-Type":mime[path.extname(p)]||"application/octet-stream"});res.end(data)})
});
server.listen(PORT,()=>console.log(`ITS website running on http://localhost:${PORT}`));
