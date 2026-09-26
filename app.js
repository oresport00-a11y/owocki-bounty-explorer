const API = 'https://owockibot.xyz/api/bounty-board';
const PROXIES = [
  `https://api.allorigins.win/raw?url=${encodeURIComponent(API)}`,
  `https://corsproxy.io/?url=${encodeURIComponent(API)}`
];
const ECO=/eco|ecolog|bioreg|water|watershed|river|lake|soil|air quality|biodivers|forest|land use|carbon|environment|sensor|conservation|regenerat|climate|green|nature|gbif|usgs|epa|worldcover/i;
let all=[]; let status='all';
const $=s=>document.querySelector(s);
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function classify(b){return ECO.test((b.title+' '+b.description).toLowerCase())?'Ecological':'General'}
function statusLabel(s){return s==='submitted'?'Submitted':s==='completed'?'Completed':s==='claimed'?'Claimed':s==='open'?'Open':s==='cancelled'?'Cancelled':s||'Unknown'}
function date(v){try{return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(v))}catch{return ''}}
function card(b){
  const s=b.status||'unknown';
  const link=b.submission_url&&/^https?:\/\//i.test(b.submission_url)?b.submission_url:'https://owockibot.xyz';
  const label=b.submission_url?'See build ↗':'Open bounty ↗';
  return `<article class="card"><div class="card-top"><span class="status ${esc(s)}">${esc(statusLabel(s))}</span><span class="reward">$${Number(b.reward_usdc||0).toLocaleString()} USDC</span></div><h3>${esc(b.title)}</h3><p>${esc(b.description||'No description provided.')}</p><div class="meta"><span class="tag">${classify(b)}</span><span class="tag">#${esc(b.id)}</span>${b.claimer_address?'<span class="tag">Builder claimed</span>':''}</div><div class="card-bottom"><span class="date">Posted ${date(b.created_at)}</span><a class="open-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${label}</a></div></article>`;
}
function render(){
  const q=$('#search').value.trim().toLowerCase();
  let items=all.filter(b=>status==='all'||b.status===status).filter(b=>!q||(b.title+' '+b.description+' '+(b.status||'')).toLowerCase().includes(q));
  const sort=$('#sort').value;
  if(sort==='reward')items.sort((a,b)=>(b.reward_usdc||0)-(a.reward_usdc||0));
  else if(sort==='oldest')items.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  else items.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  $('#resultCount').textContent=`${items.length} result${items.length===1?'':'s'}`;
  $('#grid').innerHTML=items.map(card).join('');
  $('#empty').classList.toggle('hidden',items.length>0);
}
function stats(){
  const open=all.filter(b=>b.status==='open').length;
  const completed=all.filter(b=>b.status==='submitted'||b.status==='completed').length;
  const rewards=all.reduce((n,b)=>n+Number(b.reward_usdc||0),0);
  $('#total').textContent=all.length; $('#open').textContent=open; $('#completed').textContent=completed; $('#rewards').textContent='$'+rewards.toLocaleString();
}
async function getJson(url){
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  const data=await r.json();
  if(!Array.isArray(data))throw new Error('Unexpected API response');
  return data;
}
async function load(){
  $('#error').classList.add('hidden'); $('#grid').innerHTML='<div class="empty"><p>Loading live bounties…</p></div>';
  const attempts=[API,...PROXIES]; let lastError;
  for(const url of attempts){
    try{
      all=await getJson(url); stats(); render();
      const via=url===API?'direct API':'public CORS fallback';
      $('#lastUpdated').textContent='Live data · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+' · '+via;
      return;
    }catch(e){lastError=e;}
  }
  $('#grid').innerHTML=''; $('#error').classList.remove('hidden');
  $('#errorText').textContent=(lastError?.message||'Unable to fetch the bounty board')+' — try Refresh or open the raw API link.';
  $('#lastUpdated').textContent='Live data unavailable';
}
$('.filters').addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');status=b.dataset.status;render()});
$('#search').addEventListener('input',render); $('#sort').addEventListener('change',render); $('#retry').addEventListener('click',load); load();
