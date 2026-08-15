const $=s=>document.querySelector(s);
const chat=$("#chat"), messages=$("#messages"), input=$("#chatInput");
function openChat(){chat.classList.add("open");input.focus()} function closeChat(){chat.classList.remove("open")}
function addMsg(text,who){const d=document.createElement("div");d.className="msg "+who;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
function quick(t){input.value=t;sendChat()}
async function sendChat(){const text=input.value.trim();if(!text)return;input.value="";addMsg(text,"user");const loading=document.createElement("div");loading.className="msg bot";loading.textContent="Thinking…";messages.appendChild(loading);messages.scrollTop=messages.scrollHeight;
try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text})});const data=await r.json();loading.remove();addMsg(data.reply||"Please contact our team for assistance.","bot")}catch(e){loading.remove();addMsg("I'm temporarily unable to reach the AI service. Please use the quotation form or Messenger and our team will assist you.","bot")}}
$("#chatForm").addEventListener("submit",e=>{e.preventDefault();sendChat()});
function serviceChat(s){openChat();input.value=`I need a quotation for ${s}.`;sendChat()}
$("#hamburger").onclick=()=>$("#nav").classList.toggle("open");
function openQuote(){ $("#quoteModal").classList.add("show") } function closeQuote(){ $("#quoteModal").classList.remove("show") }
async function submitForm(form,status){const fd=new FormData(form);const payload=Object.fromEntries(fd.entries());status.textContent="Sending…";try{const r=await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const d=await r.json();status.textContent=d.message||"Inquiry submitted.";if(r.ok)form.reset()}catch(e){status.textContent="Could not submit right now. Please try again or contact us directly."}}
$("#quoteForm").addEventListener("submit",e=>{e.preventDefault();submitForm(e.target,$("#quoteStatus"))});
$("#modalForm").addEventListener("submit",e=>{e.preventDefault();submitForm(e.target,$("#modalStatus"))});
fetch("/api/config").then(r=>r.json()).then(c=>{if(c.messengerUrl)$("#messenger").href=c.messengerUrl;if(c.mapQuery)$("#mapFrame").src="https://www.google.com/maps?q="+encodeURIComponent(c.mapQuery)+"&output=embed"}).catch(()=>{});
