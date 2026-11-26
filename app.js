const A = document.getElementById('app'), S = {}, P = {};
const $ = q => A.querySelector(q), wait = ms => new Promise(r => setTimeout(r, ms));
const ask = (h, init) => new Promise(res => { A.innerHTML = h; window._r = res; init && init(); });
const yrs = p => `${p.from}–${p.to>=2026?'Pres':p.to}`, ini = n => n.split(' ').map(w=>w[0]).slice(0,2).join('');
const head = (chip, title, sub) => `<div class="hd"><span class="chip">${chip}</span><h1>${title}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div>`;
const TL = r => r>=90?'ELITE':r>=80?'STRONG':'SOLID';

function home(){
  A.innerHTML = `<section class="home"><span class="chip">1990 — 2026</span><h1 class="logo">RED<br>THROUGH<br>TIME</h1>
    <p class="sub">Draft Liverpool legends from every era, conquer the 24-team league and win the shootout.</p>
    <input id="tn" placeholder="Name your club" maxlength="24" value="${S.name||''}"><button class="btn" onclick="startGame()">▶ New Game</button></section>`;
}
const coachCard = c => `<div class="row"><span class="pill">${c.from}–${c.to}</span><span class="pill gold">${TL(c.rating)}</span></div><div class="av">${ini(c.name)}</div><h3>${c.name}</h3><p class="gold sm">${c.style}</p>
  <div class="stats"><div><small>FORMATION</small><b>${c.formation}</b></div><div><small>TACTICAL BOOST</small><b class="em">${c.boost}</b></div></div><p class="q">${c.tag}</p>`;
async function startGame(){
  S.name = ($('#tn').value || 'My Reds').trim(); S.coach = null; let left = 1;
  await ask(head('STEP 01 · TECHNICAL AREA','Draft Your Manager','Scout a Liverpool tactician from 1990 to today. Your manager sets the formation and a tactical boost.') + `<div class="narrow"><div id="cc" class="card">?</div><div id="act" class="acts"><button class="btn" onclick="_r()">Draw Manager</button></div></div>`);
  let c = drawCoach();
  while (true){
    $('#act').innerHTML = '';
    for (let i=0; i<14; i++){ const x = COACHES[rnd(COACHES.length)]; $('#cc').className = 'card spin'; $('#cc').innerHTML = `<div class="av">${ini(x.name)}</div><h3>${x.name}</h3>`; await wait(40+i*8); }
    $('#cc').className = 'card ' + tier(c.rating); $('#cc').innerHTML = coachCard(c);
    const ok = await new Promise(r => { $('#act').innerHTML = (left?`<button class="btn ghost" onclick="_r(0)">Re-roll (${left} Left)</button>`:'') + `<button class="btn" onclick="_r(1)">Draft 11 Players →</button>`; window._r = r; });
    if (ok) break; left--; let f; do { f = drawCoach(); } while (f === c); c = f;
  }
  S.coach = c; S.slots = FORM[c.formation]; S.xi = []; S.left = 1;
  S.slots.forEach(s => S.xi.push(drawPlayer(s, S.xi))); draft();
}
const SG = {ALL:()=>true, FW:s=>s==='ST', MF:s=>s==='MF', DF:s=>['RB','CB','LB'].includes(s), GK:s=>s==='GK'};
function reroll(scope){
  const old = S.xi.slice(), idx = S.slots.map((s,i)=>SG[scope](s)?i:-1).filter(i=>i>=0), taken = old.filter((_,i)=>!idx.includes(i));
  idx.forEach(i => { let p, g = 0; do { p = drawPlayer(S.slots[i], taken); g++; } while (old[i]===p && g<20); taken.push(p); S.xi[i] = p; });
  S.left--; draft();
}
function draft(){
  const ovr = Math.round(S.xi.reduce((a,p)=>a+p.rating,0)/11);
  const pc = p => `<div class="pc ${tier(p.rating)}"><span class="pos">${p.pos}</span><b>${p.rating}</b><div class="nm">${p.name.split(' ').pop()}</div><small>${yrs(p)}</small><small>PEN ${p.pen}</small></div>`;
  const rows = ['ST','MF','DF','GK'].map(g => `<div class="pl">${S.xi.filter(p=>p.grp===g).map(pc).join('')}</div>`).join('');
  const list = S.xi.map(p => `<tr><td><span class="pos">${p.pos}</span></td><td>${p.name}<br><small>${yrs(p)} · #${p.num}${p.chk?'*':''}</small></td><td>${p.rating}</td><td>${p.pen}</td></tr>`).join('');
  const rr = S.left ? `<div class="acts"><small>RE-ROLL (1 LEFT):</small>${[['ALL','Full Squad'],['FW','FW'],['MF','MF'],['DF','DF'],['GK','GK']].map(([k,t])=>`<button class="btn ghost sm" onclick="reroll('${k}')">${t}</button>`).join('')}</div>` : '<div class="acts"><small>No re-roll left</small></div>';
  A.innerHTML = head('STEP 02 · STARTING XI', `${S.coach.name}'s <span class="red">${S.coach.formation}</span> XI`, `Squad OVR <b>${ovr}</b> · ${S.name} · ${S.coach.boost}`) + rr +
    `<div class="acts"><button class="btn" onclick="league()">Enter 24-Team League →</button></div><div class="grid2"><div class="panel pitch">${rows}</div>
    <div class="panel"><table><tr><th>Pos</th><th>Player</th><th>OVR</th><th>PEN</th></tr>${list}</table></div></div><p class="note">* nomor punggung belum diverifikasi</p>`;
}
function league(){ S.L = leagueSetup({name:S.name, xi:S.xi, coach:S.coach}); S.user = S.L.teams[0]; leagueView(); }
function simDay(all){ do playDay(S.L); while (all && S.L.day<8); leagueView(); }
function leagueView(){
  const L = S.L, T = tableOf(L), d = L.day, done = d>=8;
  const top = k => { const m = []; L.teams.forEach(t => Object.entries(t.st).forEach(([n,s]) => s[k] && m.push([n,s[k]]))); return m.sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>`<div class="lr"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('') || '<small>—</small>'; };
  const mine = L.matches.filter(m => m.h===0||m.a===0).reverse().map(m => { const h = m.h===0, o = L.teams[h?m.a:m.h], f = h?m.gh:m.ga, a = h?m.ga:m.gh;
    return `<div class="lr"><span>MD ${m.day} vs ${o.name}${o.champ?' 🏆':''}</span><b class="${f>a?'em':f<a?'red':''}">${f>a?'W':f<a?'L':'D'} ${f}–${a}</b></div>`; }).join('') || '<small>No matches yet</small>';
  const rows = T.map((t,i) => `<tr class="${t.user?'me':''}"><td class="${i<8?'em':'gold'}">${i+1}</td><td>${t.name}${t.champ?' 🏆':''}</td><td>${t.w+t.d+t.l}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gf-t.ga}</td><td><b>${t.pts}</b></td></tr>`).join('');
  A.innerHTML = head('STEP 03 · LEAGUE PHASE', `Liverpool Eras League <span class="chip">Matchday ${d} / 8</span>`, '24 iconic squads · 8 matches each. Top 8 advance to R16; 9th–24th enter play-offs.') +
    `<div class="acts">${done ? '<button class="btn" onclick="knockout()">Continue to Knockout →</button>' : `<button class="btn ghost" onclick="simDay()">Simulate Matchday ${d+1}</button><button class="btn" onclick="simDay(1)">Fast-Sim All 8 Matchdays</button>`}</div>
    <div class="grid2"><div class="panel"><h4>LIVE STANDINGS</h4><table><tr><th>#</th><th>Squad / Era</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>PTS</th></tr>${rows}</table></div>
    <div><div class="panel"><h4>YOUR CLUB RESULTS</h4>${mine}</div><div class="panel"><h4>TOP SCORERS</h4>${top('g')}<h4>TOP ASSISTS</h4>${top('a')}</div></div></div>`;
}
async function round(list, name){
  const win = [], log = [];
  for (let i=0; i<list.length; i+=2){
    const a = list[i], b = list[i+1];
    if (a.user || b.user){
      const opp = a.user ? b : a, r = await shootout(opp, name);
      win.push(r.won ? S.user : opp); log.push(`<div class="lr me"><span>${S.name} vs ${opp.name} (pens)</span><b>${r.us}–${r.os} ${r.won?'✅':'❌'}</b></div>`);
    } else { const r = cpuKO(a,b); win.push(r.w); log.push(`<div class="lr"><span>${a.name} ${r.s} ${b.name}</span><b>${r.w.name}</b></div>`); }
  }
  await ask(head('KNOCKOUT', name) + `<div class="narrow panel">${log.join('')}</div><div class="acts"><button class="btn" onclick="_r()">Continue →</button></div>`);
  return win;
}
async function knockout(){
  const T = tableOf(S.L), po = [];
  for (let i=0; i<8; i++) po.push(T[8+i], T[23-i]);
  const w = await round(po, 'Knockout Play-off'), r16 = [];
  for (let i=0; i<8; i++) r16.push(T[i], w[7-i]);
  let cur = await round(r16, 'Round of 16');
  cur = await round(cur, 'Quarter-final'); cur = await round(cur, 'Semi-final'); cur = await round(cur, 'Final');
  const ch = cur[0], aw = awards(S.L.teams, ch), you = ch === S.user;
  A.innerHTML = head('SEASON AWARDS', you?'🏆 You are Champions!':'Champions: '+ch.name, 'Final standings of the Liverpool Eras tournament') +
    `<div class="awards"><div class="panel"><small class="gold">GOLDEN BOOT</small><h3>${aw.scorer[0]}</h3><p>${aw.scorer[1]} goals · ${aw.scorer[2]}</p></div><div class="panel"><small class="gold">PLAYMAKER</small><h3>${aw.assist[0]}</h3><p>${aw.assist[1]} assists · ${aw.assist[2]}</p></div><div class="panel"><small class="gold">BEST MANAGER</small><h3>${aw.coach.name}</h3><p>${ch.name}</p></div></div>
    <div class="acts"><button class="btn" onclick="home()">Play Again</button></div>`;
}
async function shootout(opp, rname){
  const pool = S.user.xi.filter(p => p.pos!=='GK'), ord = [];
  while (ord.length < 5){
    const i = await ask(head(rname.toUpperCase(), 'Choose Your Takers', `Pick kicker ${ord.length+1} of 5 · ${S.name} vs ${opp.name}`) + `<div class="narrow panel"><table><tr><th>Pos</th><th>Player</th><th>PEN</th><th></th></tr>${pool.map((p,i)=>`<tr class="${ord.includes(p)?'sel':''}"><td><span class="pos">${p.pos}</span></td><td>${p.name}</td><td>${p.pen}</td><td><button class="btn ghost sm" onclick="_r(${i})">Pick</button></td></tr>`).join('')}</table></div>`);
    if (!ord.includes(pool[i])) ord.push(pool[i]);
  }
  const byPen = (a,b) => b.pen-a.pen, uGK = S.user.xi.find(p => p.pos==='GK'), oGK = opp.xi.find(p => p.pos==='GK');
  const seq = [...ord, ...pool.filter(p => !ord.includes(p)).sort(byPen), uGK].filter(Boolean);
  const oo = [...opp.xi.filter(p => p.pos!=='GK').sort(byPen), oGK].filter(Boolean);
  const gu = (uGK ? uGK.gk : 80)/85, go = (oGK ? oGK.gk : 80)/85;
  let us = 0, os = 0, r = 0; const ud = [], od = [];
  const TX = [140,200,260], TY = [62,112], ZN = ['Top Left','Top Center','Top Right','Low Left','Low Center','Low Right'];
  const dots = a => Array.from({length:Math.max(5,a.length)}, (_,i) => `<i class="${a[i]===undefined?'':a[i]?'g':'x'}"></i>`).join('');
  const scene = (who, k, side, init) => head('', '') .replace(/<div class="hd">[\s\S]*<\/div>/,'') + `<div class="panel sbar"><div><span class="chip red">${rname}</span><h2>Penalty Shootout</h2></div>
    <div class="sb"><div><b>${S.name}</b><div class="dots">${dots(ud)}</div></div><span class="sc">${us} - ${os}</span><div><b>${opp.name}</b><div class="dots">${dots(od)}</div></div></div></div>
    <div class="grid2"><div class="panel"><div class="ph"><span class="gold">KICK ${r+1}${r>=5?' · SUDDEN DEATH':''} · ${who}</span><span>${k.name} (PEN ${k.pen})</span></div>
    <svg viewBox="0 0 400 270" class="pt"><rect width="400" height="150" fill="#0d1017"/><rect y="150" width="400" height="120" fill="#0f2a1a"/><rect x="60" y="150" width="280" height="110" fill="none" stroke="#fff3" stroke-width="2"/>
    <rect x="110" y="40" width="180" height="95" fill="#c8102e11" stroke="#fff" stroke-width="5"/><path d="M110 40h180M110 60h180M110 80h180M110 100h180M110 120h180M130 40v95M150 40v95M170 40v95M190 40v95M210 40v95M230 40v95M250 40v95M270 40v95" stroke="#fff2" fill="none"/>
    <circle id="tg" r="10" fill="#d4af3722" stroke="#d4af37" stroke-width="2" visibility="hidden"/>
    <g id="gk" fill="#fb923c"><circle cx="200" cy="82" r="7"/><rect x="190" y="90" width="20" height="28" rx="6"/><circle cx="184" cy="98" r="4" fill="#fff"/><circle cx="216" cy="98" r="4" fill="#fff"/></g>
    <circle id="ball" cx="200" cy="225" r="9" fill="#fff"/></svg></div><div class="panel side">${side}</div></div>`;
  const shot = async (res, z, dv, who, k, msg) => {
    A.innerHTML = scene(who, k, `<h3>${msg}</h3>`); await wait(80);
    const side = z%3, row = z<3?0:1; let dx = TX[side]-200, dy = TY[row]-225;
    if (res==='miss'){ if (rnd(2)) dx = (side===2?1:side===0?-1:(rnd(2)?1:-1))*108; else dy = -212; }
    $('#ball').style.transform = `translate(${dx}px,${dy}px) scale(.55)`; $('#gk').style.transform = `translate(${(dv-1)*55}px,${dv===1?-8:6}px) rotate(${(dv-1)*65}deg)`;
    await wait(1900);
  };
  const done = after => { const ru = 4-r, ro = after ? 4-r : 5-r; return r<5 ? (us>os+ro || os>us+ru) : (after && us!==os); };
  while (true){
    const k = seq[r%seq.length]; P.z = -1;
    const kick = await ask(scene('YOUR KICK', k, `<h3>Choose Shot Placement</h3><p class="sub">Pick a corner, then strike while the power bar is inside the sweet spot.</p><div class="zg">${ZN.map((t,i)=>`<button class="btn ghost zb" onclick="P.z=${i};document.querySelectorAll('.zb').forEach((b,j)=>b.classList.toggle('on',j===${i}));const g=document.getElementById('tg');g.setAttribute('cx',[140,200,260][${i}%3]);g.setAttribute('cy',[62,112][${i}<3?0:1]);g.setAttribute('visibility','visible')">${t}</button>`).join('')}</div>
      <small class="mut">SHOT POWER</small><div class="power"><i id="pb"></i><u></u></div><button class="btn wide" onclick="P.z>=0&&_r({z:P.z,pw:P.v})">Strike Penalty</button>`), () => {
      let t = 0; P.v = 0; P.t = setInterval(() => { t += 0.05; P.v = Math.abs(Math.sin(t)); $('#pb').style.width = P.v*100+'%'; }, 20); });
    clearInterval(P.t); const z = kick.z, pw = kick.pw, side = z%3;
    let dv = [0,0,1,2,2][rnd(5)];
    const res = Math.random() < (pw>0.93 ? 0.85 : (100-k.pen)/350) ? 'miss' : (dv===side && Math.random() < Math.min(.95,(pw<.35?.9:pw<.7?.65:.4)*(z<3?.8:1)*go)) ? 'save' : 'goal';
    if (res==='save') dv = side; else if (dv===side) dv = (side+1+rnd(2))%3;
    if (res==='goal') us++; ud.push(res==='goal');
    await shot(res, z, dv, 'YOUR KICK', k, res==='goal'?'⚽ GOAL!':res==='save'?'🧤 Saved by the keeper!':'❌ Missed the target!');
    if (done(false)) break;
    const ok = oo[r%oo.length], cz = rnd(6), cs = cz%3;
    const d = await ask(scene('THEIR KICK', ok, `<h3>Anticipate the Kick</h3><p class="sub">${ok.name} steps up. Choose which way your keeper dives.</p><button class="btn ghost wide" onclick="_r(0)">⬅ Dive Left</button><button class="btn ghost wide" onclick="_r(1)">⬆ Stay Center</button><button class="btn ghost wide" onclick="_r(2)">Dive Right ➡</button>`));
    const o = Math.random() < (100-ok.pen)/350 ? 'miss' : (d===cs && Math.random()<Math.min(.95,.75*gu)) ? 'save' : 'goal';
    if (o==='goal') os++; od.push(o==='goal');
    await shot(o, cz, d, 'THEIR KICK', ok, o==='goal'?'😬 They score':o==='save'?'🧤 SAVE! You stopped it!':'🙌 They missed!');
    if (done(true)) break;
    r++;
  }
  return {won: us>os, us, os};
}
home();
