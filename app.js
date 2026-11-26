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
const ncl = k => COACHES.filter(c => TL(c.rating)===k).length;
async function startGame(){
  S.name = ($('#tn').value || 'My Reds').trim(); S.coach = null; let left = 1;
  await ask(head('STEP 01 · TECHNICAL AREA','Draft Your Manager','Scout a Liverpool tactician from 1990 to today. Your manager sets the formation and a tactical boost.') + `<div class="narrow"><div id="cc" class="card pack"><div class="fan"><div class="fc c1">RB</div><div class="fc c2">JK</div><div class="fc c3">AS</div></div><small class="gold">ANFIELD HERITAGE PACK</small><h3>${COACHES.length} Legendary Managers</h3><p class="sub sm">1990 — 2026 · every era, one tactician</p><div class="row3"><span class="pill gold">ELITE ×${ncl('ELITE')}</span><span class="pill">STRONG ×${ncl('STRONG')}</span><span class="pill">SOLID ×${ncl('SOLID')}</span></div></div><div id="act" class="acts"><button class="btn" onclick="_r()">Scout Manager</button></div></div>`);
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
    <div class="panel"><table><tr><th>Pos</th><th>Player</th><th>OVR</th><th>PEN</th></tr>${list}</table></div></div><p class="note"></p>`;
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
      win.push(r.won ? S.user : opp); if (!r.won) S.out = name; log.push(`<div class="lr me"><span>${S.name} vs ${opp.name} (pens)</span><b>${r.us}–${r.os} ${r.won?'✅':'❌'}</b></div>`);
    } else { const r = cpuKO(a,b); win.push(r.w); log.push(`<div class="lr"><span>${a.name} ${r.s} ${b.name}</span><b>${r.w.name}</b></div>`); }
  }
  await ask(head('KNOCKOUT', name) + `<div class="narrow panel">${log.join('')}</div><div class="acts"><button class="btn" onclick="_r()">Continue →</button></div>`);
  return win;
}
async function knockout(){
  S.out = null; const T = tableOf(S.L), po = [];
  for (let i=0; i<8; i++) po.push(T[8+i], T[23-i]);
  const w = await round(po, 'Knockout Play-off'), r16 = [];
  for (let i=0; i<8; i++) r16.push(T[i], w[7-i]);
  let cur = await round(r16, 'Round of 16');
  cur = await round(cur, 'Quarter-final'); cur = await round(cur, 'Semi-final'); cur = await round(cur, 'Final');
  const ch = cur[0], aw = awards(S.L.teams, ch), you = ch === S.user;
  const lst = k => { const m = []; S.L.teams.forEach(t => Object.entries(t.st).forEach(([n,x]) => x[k] && m.push({n, v:x[k], t:t.name, me:t.user})));
    return m.sort((a,b)=>b.v-a.v).slice(0,10).map((x,i) => `<div class="lr${x.me?' you':''}"><span>${i+1}. ${x.n} ${x.me?`<em>★ ${S.name}</em>`:`<small>${x.t}</small>`}</span><b>${x.v}</b></div>`).join(''); };
  const me = n => n === S.name ? ' you' : '';
  A.innerHTML = `<section class="panel final${you?' champ':''}"><span class="chip gold">${you?'★ TOURNAMENT CHAMPIONS ★':'SEASON COMPLETE'}</span><h1>${S.name}</h1><p class="sub">${S.coach.name} · ${S.coach.formation} · ${you?'Crowned champions of the Liverpool Eras tournament.':'Champions: '+ch.name}</p>
    <span class="pill">Your journey: ${you?'🏆 Champions':'Out in '+(S.out||'the league phase')}</span></section>
    <div class="awards"><div class="panel${me(aw.scorer[2])}"><small class="gold">GOLDEN BOOT</small><h3>${aw.scorer[0]}</h3><p>${aw.scorer[2]}</p><div class="lr"><span>Tournament goals</span><b>${aw.scorer[1]}</b></div></div>
    <div class="panel${me(aw.assist[2])}"><small class="em">PLAYMAKER AWARD</small><h3>${aw.assist[0]}</h3><p>${aw.assist[2]}</p><div class="lr"><span>Tournament assists</span><b>${aw.assist[1]}</b></div></div>
    <div class="panel"><small class="red">BEST MANAGER</small><h3>${aw.coach.name}</h3><p>${ch.name}</p><div class="lr"><span>Tactical rating</span><b>${aw.coach.rating} OVR</b></div></div></div>
    <div class="grid2e"><div class="panel"><h4>TOP 10 GOALSCORERS</h4>${lst('g')}</div><div class="panel"><h4>TOP 10 ASSIST PROVIDERS</h4>${lst('a')}</div></div>
    <div class="acts"><button class="btn" onclick="home()">Play Again</button></div>`;
}
async function shootout(opp, rname){
  const pool = S.user.xi.filter(p => p.pos!=='GK'); let ord = [];
  while (true){
    const i = await ask(head(rname.toUpperCase(), 'Choose Your Takers', `Select 5 takers (${ord.length}/5) · slot order = kick order · ${S.name} vs ${opp.name}`) +
      `<div class="acts"><button class="btn ghost" onclick="_r(-1)">⚡ Auto: Top Rating</button><button class="btn ghost" onclick="_r(-2)">🎯 Auto: Top PEN</button><button class="btn ghost" onclick="_r(-3)">↺ Clear</button></div>
      <div class="slots">${[0,1,2,3,4].map(n => `<div class="sl${ord[n]?' on':''}"><small>KICK ${n+1}</small><b>${ord[n]?ord[n].name:'—'}</b>${ord[n]?`<small>OVR ${ord[n].rating} · PEN ${ord[n].pen}</small>`:''}</div>`).join('')}</div>
      <div class="acts"><button class="btn" ${ord.length<5?'disabled':''} onclick="_r(-9)">Start Shootout →</button></div>
      <div class="narrow panel"><table><tr><th>Pos</th><th>Player</th><th>OVR</th><th>PEN</th><th></th></tr>${pool.map((p,i)=>`<tr class="${ord.includes(p)?'hi':''}"><td><span class="pos">${p.pos}</span></td><td>${ord.includes(p)?'<b class="gold">#'+(ord.indexOf(p)+1)+'</b> ':''}${p.name}</td><td>${p.rating}</td><td>${p.pen}</td><td><button class="btn ghost sm" onclick="_r(${i})">${ord.includes(p)?'Remove':'Pick'}</button></td></tr>`).join('')}</table></div>`);
    if (i===-9 && ord.length===5) break;
    if (i===-1 || i===-2){ const k = i===-1 ? 'rating' : 'pen'; ord = pool.slice().sort((x,y)=>y[k]-x[k]).slice(0,5); }
    else if (i===-3) ord = [];
    else if (i>=0){ const p = pool[i], j = ord.indexOf(p); if (j>=0) ord.splice(j,1); else if (ord.length<5) ord.push(p); }
  }
  const byPen = (a,b) => b.pen-a.pen, uGK = S.user.xi.find(p => p.pos==='GK'), oGK = opp.xi.find(p => p.pos==='GK');
  const seq = [...ord, ...pool.filter(p => !ord.includes(p)).sort(byPen), uGK].filter(Boolean);
  const oo = [...opp.xi.filter(p => p.pos!=='GK').sort(byPen), oGK].filter(Boolean);
  const gu = (uGK ? uGK.gk : 80)/85, go = (oGK ? oGK.gk : 80)/85;
  let us = 0, os = 0, r = 0; const ud = [], od = [];
  const TX = [140,200,260], TY = [62,112], ZN = ['Top Left','Top Center','Top Right','Low Left','Low Center','Low Right'];
  const hab = n => [...n].reduce((a,c)=>a+c.charCodeAt(0),0)%6;
  const zoneBtns = () => ZN.map((t,i)=>`<button class="btn ghost zb" onclick="P.z=${i};document.querySelectorAll('.zb').forEach((b,j)=>b.classList.toggle('on',j===${i}));const g=document.getElementById('tg');g.setAttribute('cx',[140,200,260][${i}%3]);g.setAttribute('cy',[62,112][${i}<3?0:1]);g.setAttribute('visibility','visible')">${t}</button>`).join('');
  const dots = a => Array.from({length:Math.max(5,a.length)}, (_,i) => `<i class="${a[i]===undefined?'':a[i]?'g':'x'}"></i>`).join('');
  const scene = (who, k, side, init) => { const gkc = who==='YOUR KICK' ? '#fb923c' : '#10b981'; return head('', '') .replace(/<div class="hd">[\s\S]*<\/div>/,'') + `<div class="panel sbar"><div><span class="chip red">${rname}</span><h2>Penalty Shootout</h2></div>
    <div class="sb"><div><b>${S.name}</b><div class="dots">${dots(ud)}</div></div><span class="sc">${us} - ${os}</span><div><b>${opp.name}</b><div class="dots">${dots(od)}</div></div></div></div>
    <div class="grid2"><div class="panel"><div class="ph"><span class="gold">KICK ${r+1}${r>=5?' · SUDDEN DEATH':''} · ${who}</span><span>${k.name} (PEN ${k.pen})</span></div>
    <div class="stage"><svg viewBox="0 0 400 270" class="pt"><defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#103020"/><stop offset="1" stop-color="#091a10"/></linearGradient></defs>
    <rect width="400" height="135" fill="#0d1017"/><rect y="135" width="400" height="135" fill="url(#gr)"/>
    <g stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none"><path d="M0 135H400"/><rect x="50" y="135" width="300" height="120"/><rect x="120" y="135" width="160" height="50"/></g><circle cx="200" cy="225" r="2.5" fill="#fff" opacity=".6"/>
    <rect x="110" y="40" width="180" height="95" fill="#c8102e12"/><g class="net"><path d="M110 55h180M110 70h180M110 85h180M110 100h180M110 115h180M128 40v95M146 40v95M164 40v95M182 40v95M200 40v95M218 40v95M236 40v95M254 40v95M272 40v95" stroke="#fff" stroke-opacity=".18" fill="none"/></g>
    <ellipse cx="200" cy="138" rx="98" ry="4" fill="#000" opacity=".45"/><path d="M110 135V40H290V135" stroke="#fff" stroke-width="5" fill="none"/>
    <circle id="tg" r="10" fill="#d4af3722" stroke="#d4af37" stroke-width="2" visibility="hidden"/>
    <g id="gk" fill="${gkc}"><circle cx="200" cy="84" r="7"/><rect x="190" y="92" width="20" height="30" rx="6"/><rect x="192" y="121" width="6" height="13"/><rect x="202" y="121" width="6" height="13"/><circle cx="184" cy="100" r="4" fill="#fff"/><circle cx="216" cy="100" r="4" fill="#fff"/></g>
    <circle id="ball" cx="200" cy="225" r="9" fill="#fff"/></svg></div>
    <div class="kname"><small>${who==='YOUR KICK'?'YOUR TAKER':'OPPONENT TAKER · '+opp.name}</small><b>${k.name}</b><span>${k.pos} · OVR ${k.rating} · PEN ${k.pen}</span></div></div><div class="panel side">${side}</div></div>`; };
  const fx = (type, txt) => { const d = document.createElement('div'); d.className = 'fx '+type;
    d.innerHTML = `<div class="bn">${txt}</div>` + (type==='miss' ? '' : Array.from({length:28}, (_,i) => { const an = i*(Math.PI*2/28), r = 70+rnd(120);
      return `<i style="--x:${Math.cos(an)*r}px;--y:${Math.sin(an)*r}px;--c:${['#d4af37','#dc1b3a','#ffffff',type==='save'?'#38bdf8':'#10b981'][i%4]}"></i>`; }).join(''));
    $('.stage').appendChild(d); if (type==='goal') $('.net').classList.add('rip'); if (type==='save') $('#gk').classList.add('glow'); };
  const shot = async (res, z, dv, who, k, msg, det) => {
    A.innerHTML = scene(who, k, '<h3>…</h3><p class="sub">The ball is on its way</p>'); await wait(80);
    const side = z%3, row = z<3?0:1; let dx = TX[side]-200, dy = TY[row]-225;
    if (res==='miss'){ if (rnd(2)) dx = (side===2?1:side===0?-1:(rnd(2)?1:-1))*108; else dy = -212; }
    $('#ball').style.transform = `translate(${dx}px,${dy}px) scale(.55)`; $('#gk').style.transform = `translate(${(dv-1)*55}px,${dv===1?-8:6}px) rotate(${(dv-1)*65}deg)`;
    await wait(950); fx(res, res==='goal'?'GOAL!':res==='save'?'SAVED!':'MISSED');
    $('.side').innerHTML = `<h3>${msg}</h3><p class="sub">${det}</p>`; await wait(1500);
  };
  const done = after => { const ru = 4-r, ro = after ? 4-r : 5-r; return r<5 ? (us>os+ro || os>us+ru) : (after && us!==os); };
  while (true){
    const k = seq[r%seq.length]; P.z = -1;
    const kick = await ask(scene('YOUR KICK', k, `<h3>Choose Shot Placement</h3><p class="sub">Pick a corner, then strike while the power bar is inside the sweet spot.</p><div class="zg">${zoneBtns()}</div>
      <small class="mut">SHOT POWER</small><div class="power"><i id="pb"></i><u></u></div><button class="btn wide" onclick="P.z>=0&&_r({z:P.z,pw:P.v})">Strike Penalty</button>`), () => {
      let t = 0; P.v = 0; P.t = setInterval(() => { t += 0.05; P.v = Math.abs(Math.sin(t)); $('#pb').style.width = P.v*100+'%'; }, 20); });
    clearInterval(P.t); const z = kick.z, pw = kick.pw, side = z%3;
    let dv = Math.random()<.4 ? hab(oGK?oGK.name:'')%3 : [0,0,1,2,2][rnd(5)];
    const res = Math.random() < (pw>0.93 ? 0.85 : (100-k.pen)/350) ? 'miss' : (dv===side && Math.random() < Math.min(.95,(pw<.35?.9:pw<.7?.65:.4)*(z<3?.8:1)*go)) ? 'save' : 'goal';
    if (res==='save') dv = side; else if (dv===side) dv = (side+1+rnd(2))%3;
    if (res==='goal') us++; ud.push(res==='goal');
    await shot(res, z, dv, 'YOUR KICK', k, res==='goal'?'Goal for you':res==='save'?'Saved by the keeper':'Off target', `You aimed ${ZN[z]} · keeper dived ${['left','centre','right'][dv]}`);
    if (done(false)) break;
    const ok = oo[r%oo.length], cz = Math.random()<.45 ? hab(ok.name) : rnd(6), cs = cz%3; P.z = -1;
    const d = await ask(scene('THEIR KICK', ok, `<h3>Choose Keeper Dive</h3><p class="sub">Read ${ok.name}'s habits and lock in where your keeper goes. Exact corner = best chance; right side only = partial.</p><div class="zg">${zoneBtns()}</div><button class="btn wide" onclick="P.z>=0&&_r(P.z)">Commit Dive</button>`));
    const o = Math.random() < (100-ok.pen)/350 ? 'miss' : (d===cz || (d%3===cs && Math.random() < .5*gu)) ? 'save' : 'goal';
    if (o==='goal') os++; od.push(o==='goal');
    await shot(o, cz, d%3, 'THEIR KICK', ok, o==='goal'?'They score':o==='save'?'You stopped it!':'They missed', `They shot ${ZN[cz]} · you chose ${ZN[d]}`);
    if (done(true)) break;
    r++;
  }
  return {won: us>os, us, os};
}
home();
