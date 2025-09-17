let Trips = []
let curTrip = null
let People=[]
let Expenses=[]
let curr="INR"

const symb={ INR:"₹", USD:"$", EUR:"€" }

function login (){
 let u=document.getElementById("user").value
 let p=document.getElementById("pass").value
 let msg=document.getElementById("msg")
 showLoader()
 setTimeout(()=>{
  if(u==="user" && p==="pass"){
   hideLoader()
   showPage("trips")
   msg.textContent=""
   animatePageEnter()
  } else {
   hideLoader()
   msg.textContent="Wrong login"
   anime({targets:'#msg',translateX:[20,-20,0],duration:500,easing:'easeInOutQuad'})
  }
 },1000)
}

function showPage(pg){
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hide"))
 document.getElementById(pg).classList.remove("hide")
}

function showLoader(){
 let l=document.getElementById("loader")
 l.style.display="flex"
 anime({targets:'.loader-circle',scale:[1,1.5,1],duration:800,delay:anime.stagger(200),loop:true,easing:'easeInOutQuad'})
}
function hideLoader(){ document.getElementById("loader").style.display="none" }

function animatePageEnter(){
 anime({targets:'.card',opacity:[0,1],translateY:[30,0],duration:600,delay:anime.stagger(100),easing:'easeOutQuad'})
}

function animateBtn(el){
 anime({targets:el,scale:[1,.95,1],duration:200,easing:'easeInOutQuad'})
}

function openSidebar(){
 document.getElementById("sidebar").classList.add("open")
 anime({targets:'.sidebar ul li',translateX:[-50,0],opacity:[0,1],duration:400,delay:anime.stagger(100),easing:'easeOutQuad'})
}
function closeSidebar(){ document.getElementById("sidebar").classList.remove("open") }

function showTrips(){
 showPage("trips"); closeSidebar(); renderTrips(); animatePageEnter()
}
function showResults(){ alert("Coming soon"); closeSidebar() }
function showProfile(){ alert("Coming soon"); closeSidebar() }

function showForm(){ document.getElementById("form").classList.remove("hide") }
function hideForm(){ document.getElementById("form").classList.add("hide"); document.getElementById("tripname").value="" }

function addTrip(){
 let nm=document.getElementById("tripname").value.trim()
 if(!nm){ alert("Enter trip name"); return }
 if(Trips.find(t=>t.name===nm)){ alert("Trip exists"); return }
 Trips.push({name:nm,people:[],Expenses:[],id:Date.now()})
 hideForm(); renderTrips()
}

function renderTrips(){
 let list=document.getElementById("triplist"); list.innerHTML=""
 if(Trips.length===0){ list.innerHTML='<li class="empty">No trips yet</li>'; return }
 Trips.forEach((t,i)=>{
  let total=t.Expenses.reduce((s,e)=>s+e.amount,0)
  let li=document.createElement("li")
  li.innerHTML=`<div><strong>${t.name}</strong><br><small>${t.people.length} people, ${symb[curr]}${total.toFixed(2)}</small></div><button onclick="delTrip(${i})">Delete</button>`
  li.onclick=()=>openTrip(i)
  list.appendChild(li)
 })
}

function delTrip(i){ if(confirm("Delete trip?")){ Trips.splice(i,1); renderTrips() } }

function openTrip(i){
 curTrip=i
 let t=Trips[i]
 People=[...t.people]; Expenses=[...t.Expenses]
 document.getElementById("tripTitle").textContent=t.name
 showPage("calc"); renderPeople(); renderExpenses(); calc()
}

function addPerson(){
 let n=document.getElementById("person").value.trim()
 if(!n){ alert("Enter name"); return }
 if(People.includes(n)){ alert("Person exists"); return }
 People.push(n); Trips[curTrip].people=[...People]; document.getElementById("person").value=""
 renderPeople(); calc()
 anime({targets:'#people li:last-child',scale:[0,1],opacity:[0,1],duration:400,easing:'easeOutQuad'})
}

function renderPeople(){
 let list=document.getElementById("people"); list.innerHTML=""
 if(People.length===0){ list.innerHTML='<li class="empty">No people yet</li>'; return }
 People.forEach((p,i)=>{
  let li=document.createElement("li")
  li.className="list-item"
  li.innerHTML=`<span>${p}</span><button onclick="remPerson(${i}); animateBtn(this)">Remove</button>`
  list.appendChild(li)
 })
}
function remPerson(i){ People.splice(i,1); Trips[curTrip].people=[...People]; renderPeople(); calc() }

function addExpense(){
 let d=document.getElementById("desc").value.trim()
 let a=parseFloat(document.getElementById("amount").value)
 if(!d){ alert("Enter description"); return }
 if(!a||a<=0){ alert("Enter valid amount"); return }
 Expenses.push({desc:d,amount:a,id:Date.now()})
 Trips[curTrip].Expenses=[...Expenses]
 document.getElementById("desc").value=""; document.getElementById("amount").value=""
 renderExpenses(); calc()
 anime({targets:'#expenses li:last-child',scale:[0,1],opacity:[0,1],duration:400,easing:'easeOutQuad'})
}

function renderExpenses(){
 let list=document.getElementById("expenses"); list.innerHTML=""
 if(Expenses.length===0){ list.innerHTML='<li class="empty">No expenses yet</li>'; return }
 Expenses.forEach((e,i)=>{
  let li=document.createElement("li"); li.className="list-item"
  li.innerHTML=`<div><strong>${e.desc}</strong><br><small>${symb[curr]}${e.amount.toFixed(2)}</small></div><button onclick="remExpense(${i}); animateBtn(this)">Remove</button>`
  list.appendChild(li)
 })
}
function remExpense(i){ Expenses.splice(i,1); Trips[curTrip].Expenses=[...Expenses]; renderExpenses(); calc() }

function calc(){
 let res=document.getElementById("result"), dl=document.getElementById("download")
 if(People.length===0){ res.innerHTML="<p>Add people first</p>"; dl.classList.add("hide"); return }
 if(Expenses.length===0){ res.innerHTML="<p>Add expenses first</p>"; dl.classList.add("hide"); return }
 let total=Expenses.reduce((s,x)=>s+x.amount,0)
 let share=total/People.length
 let h=`<h4>Total: ${symb[curr]}${total.toFixed(2)}</h4><p>Per person: ${symb[curr]}${share.toFixed(2)}</p><hr>`
 People.forEach(p=>{ h+=`<p>${p}: ${symb[curr]}${share.toFixed(2)}</p>` })
 res.innerHTML=h; dl.classList.remove("hide")
 anime({targets:'#result',opacity:[0,1],scale:[.9,1],duration:500,easing:'easeOutQuad'})
}

function changeCurrency(){
 let s1=document.getElementById("currency"), s2=document.getElementById("calcCurrency")
 if(s1) curr=s1.value; if(s2) curr=s2.value
 if(s1&&s2){ s1.value=curr; s2.value=curr }
 renderTrips(); renderExpenses(); calc()
}

function downloadPdf(){
 if(curTrip===null){ alert("No trip selected"); return }
 if(typeof jsPDF==='undefined'&&typeof window.jsPDF==='undefined'){ alert("PDF library not loaded"); return }
 try{
  let doc=new (window.jsPDF||jsPDF)()
  let t=Trips[curTrip]
  let total=Expenses.reduce((s,e)=>s+e.amount,0)
  let share=People.length>0?total/People.length:0
  doc.setFontSize(20); doc.text("Trip Expense Report",20,30)
  doc.setFontSize(16); doc.text("Trip: "+t.name,20,50)
  doc.setFontSize(12); let y=70
  if(People.length>0){ doc.text("People:",20,y); y+=10; People.forEach(p=>{doc.text("- "+p,25,y); y+=8}); y+=10 }
  if(Expenses.length>0){ doc.text("Expenses:",20,y); y+=10; Expenses.forEach(e=>{doc.text("- "+e.desc+": "+symb[curr]+e.amount.toFixed(2),25,y); y+=8}); y+=10 }
  doc.text("Total: "+symb[curr]+total.toFixed(2),20,y); y+=8
  doc.text("Per person: "+symb[curr]+share.toFixed(2),20,y)
  doc.save(t.name+"_split.pdf")
 }catch(err){
  console.error("PDF error:",err)
  let t=Trips[curTrip]
  let c="Trip: "+t.name+"\n\nPeople:\n"+People.join(", ")+"\n\nExpenses:\n"
  let ex=""; Expenses.forEach(e=>{ex+=e.desc+": "+symb[curr]+e.amount.toFixed(2)+"\n"})
  let total=Expenses.reduce((s,e)=>s+e.amount,0)
  let share=People.length>0?total/People.length:0
  let fc=c+ex+"\nTotal: "+symb[curr]+total.toFixed(2)+"\nPer person: "+symb[curr]+share.toFixed(2)
  let blob=new Blob([fc],{type:"text/plain"}), url=URL.createObjectURL(blob), a=document.createElement("a")
  a.href=url; a.download=t.name+"_split.txt"; a.click(); URL.revokeObjectURL(url)
 }
}

document.addEventListener("DOMContentLoaded",()=>{ renderTrips() })

