const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('.menu'),nav=$('#nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});$$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));}
const assembly=$('.assembly'),replay=$('#replay');
if(assembly&&replay){replay.addEventListener('click',()=>{assembly.classList.add('replay');requestAnimationFrame(()=>requestAnimationFrame(()=>assembly.classList.remove('replay')))});}
const lab=$('[data-lab]');
if(lab){
 const state={scenario:'exception',severity:3,variability:4,latency:3,autonomy:3};
 const presets={knowledge:{severity:2,variability:3,latency:2,autonomy:2},exception:{severity:3,variability:4,latency:3,autonomy:3},engineering:{severity:4,variability:2,latency:3,autonomy:1}};
 const posture=()=>{const risk=state.severity*1.45+state.variability*.9+state.autonomy*.8+state.latency*.35;
  if(state.severity>=5||risk>=14.2)return['Hold for redesign','High consequence or combined operating risk exceeds the evidence and authority represented. Narrow the action, strengthen evaluation and resolve ownership before release.','Human-first decision; AI prepares evidence','Adversarial, repeated-run, tool-failure and rollback','Complete traces plus policy and security events','Redesign or tightly bounded shadow mode'];
  if(risk>=11.1)return['Execute with approval','The workflow can advance only with explicit approval, strong traceability, representative evaluation and a named operating owner.','Approval before consequential action','Representative + adversarial + repeated-run','Full tool trace, cost, latency, retries, overrides','Bounded pilot with named owner'];
  if(risk>=8.1)return['Recommend, human decides','AI may synthesize evidence and recommend an action while a human retains final authority and the system records the decision path.','Human decision at workflow boundary','Representative cases + edge cases + regression','Inputs, outputs, retrieval, tool calls, overrides','Pilot with review cadence'];
  if(risk>=5.6)return['Assist inside the workflow','Use AI to retrieve, summarize, draft and organize work without granting independent consequential authority.','Human acts; AI prepares','Functional + groundedness + regression','Source attribution, latency and feedback','Limited release with monitored adoption'];
  return['Bounded autonomous execution','Low consequence, stable work and limited permissions support narrowly bounded autonomy with monitoring and reliable fallback.','Human owns policy and exceptions','Regression + drift + tool-state coverage','Action trace, exceptions, cost and latency','Canary release with automatic fallback'];};
 const render=()=>{['severity','variability','latency','autonomy'].forEach(k=>{state[k]=+$(`#${k}`,lab).value;$(`[data-out="${k}"]`,lab).textContent=`${state[k]} / 5`});const[p,r,h,e,o,rel]=posture();$('[data-posture]',lab).textContent=p;$('[data-rationale]',lab).textContent=r;$('[data-req="human"]',lab).textContent=h;$('[data-req="evaluation"]',lab).textContent=e;$('[data-req="observability"]',lab).textContent=o;$('[data-req="release"]',lab).textContent=rel;};
 $$('input[type=range]',lab).forEach(i=>i.addEventListener('input',render));
 $$('[data-scenario]',lab).forEach(b=>b.addEventListener('click',()=>{$$('[data-scenario]',lab).forEach(x=>{x.classList.remove('active');x.setAttribute('aria-selected','false')});b.classList.add('active');b.setAttribute('aria-selected','true');state.scenario=b.dataset.scenario;Object.entries(presets[state.scenario]).forEach(([k,v])=>$(`#${k}`,lab).value=v);render()}));
 $('[data-reset]',lab).addEventListener('click',()=>{$$('[data-scenario]',lab).forEach(x=>{const on=x.dataset.scenario==='exception';x.classList.toggle('active',on);x.setAttribute('aria-selected',String(on))});Object.entries(presets.exception).forEach(([k,v])=>$(`#${k}`,lab).value=v);render()});
 render();
}
