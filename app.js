const A = document.getElementById('app'), S = {}, P = {};
const $ = q => A.querySelector(q), wait = ms => new Promise(r => setTimeout(r, ms));
const ask = (html, init) => new Promise(res => { A.innerHTML = html; window._r = res; init && init(); });
const bar = t => `<div class="bar"><small>RED THROUGH TIME</small>${t?'<h2>'+t+'</h2>':''}</div>`;
const info = p => `<b>${p.rating}</b>${p.name}<br>${p.pos||'Formasi '+p.formation}${p.num?' · No. '+p.num+(p.chk?'*':''):''}`;

function home(){
  A.innerHTML = `<div class="pad"><h1>RED<br>THROUGH<br>TIME</h1><div class="tag">1990 — 2026</div>
  <input id="tn" placeholder="Nama timmu" maxlength="24" value="${S.name||''}"><button onclick="startGame()" style="width:100%">▶ New Game</button>
  <p class="tag" style="text-align:center;margin-top:30px">EVERY ERA HAS ITS LEGENDS</p></div>`;
}
const squad = () => `<table><tr><th>Pos</th><th>No</th><th>Nama</th><th>Rtg</th></tr>${S.xi.map(p=>`<tr><td>${p.pos}</td><td>${p.num}${p.chk?'*':''}</td><td>${p.name}</td><td>${p.rating}</td></tr>`).join('')}</table>`;
async function roll(title, pool, drawFn){
  await ask(bar(S.name) + `<div class="two"><div><h3>${title}</h3><div id="spin" class="spinbox">?</div><div id="act"><button onclick="_r()">Tarik</button></div></div>
    <div><h3>Skuad${S.coach?' · '+S.coach.name+' ('+S.coach.formation+')':''}</h3>${S.xi?squad():''}</div></div>`);
  let final = drawFn(), left = 1;
  while (true){
    $('#act').innerHTML = ''; const box = $('#spin'); let d = 35;
    for (let i=0; i<14; i++){ box.className = 'spinbox spin'; box.innerHTML = info(pool[rnd(pool.length)]); await wait(d); d += 8; }
    box.className = 'spinbox ' + tier(final.rating); box.innerHTML = info(final);
    const ok = await new Promise(r => { $('#act').innerHTML = '<button onclick="_r(1)">Terima</button>' + (left ? `<button class="ghost" onclick="_r(0)">Kesempatan kedua (${left})</button>` : ''); window._r = r; });
    if (ok) return final;
    left--; let f; do { f = drawFn(); } while (f === final && pool.length > 1); final = f;
  }
}
async function startGame(){
  S.name = ($('#tn').value || 'My Reds').trim(); S.xi = null; S.coach = null;
  S.coach = await roll('Tarik Pelatih', COACHES, drawCoach);
  S.xi = [];
  for (const slot of FORM[S.coach.formation])
    S.xi.push(await roll(`Slot ${S.xi.length+1}/11: ${slot}`, PLAYERS.filter(p=>fits(slot,p)), () => drawPlayer(slot, S.xi)));
  await ask(bar(S.name) + `<div class="pad"><h3>Build Your Squad!</h3><p class="sub">${S.name} · ${S.coach.name} (${S.coach.formation})</p><div class="pitchv">${['ST','MF','DF','GK'].map(g=>`<div class="pl">${S.xi.filter(p=>p.grp===g).map(p=>`<div><span class="shirt"></span>${p.name.split(' ').pop()}<br>${p.rating}</div>`).join('')}</div>`).join('')}</div><p>Kekuatan tim: <b>${strength(S.xi,S.coach).toFixed(1)}</b></p><button onclick="_r()">Mulai Liga</button></div>`);
  league();
}
function league(){
  const r = S.res = runLeague({name:S.name, xi:S.xi, coach:S.coach}), me = S.user = r.teams[0], pos = r.table.indexOf(me)+1;
  const mine = r.matches.filter(m => m.h===0||m.a===0).map(m => { const h = m.h===0, o = r.teams[h?m.a:m.h], f = h?m.gh:m.ga, a = h?m.ga:m.gh;
    return `<li class="${f>a?'w':f<a?'l':''}">${h?'(H)':'(A)'} ${o.name}${o.champ?' 🏆':''} <b>${f}-${a}</b></li>`; }).join('');
  const tbl = r.table.map((t,i) => `<tr class="${t.user?'me':''} ${i<8?'top':'po'}"><td>${i+1}</td><td>${t.name}${t.champ?' 🏆':''}</td><td>${t.w}-${t.d}-${t.l}</td><td>${t.gf-t.ga}</td><td><b>${t.pts}</b></td></tr>`).join('');
  A.innerHTML = bar('Liga') + `<div class="pad"><p class="status">Peringkat ${pos}: ${pos<=8?'lolos langsung ke 16 besar!':'main playoff.'}</p><ol class="matches">${mine}</ol>
    <table><tr><th>#</th><th>Tim</th><th>M-S-K</th><th>SG</th><th>Poin</th></tr>${tbl}</table><button onclick="knockout()">Lanjut ke Knockout</button></div>`;
}
async function round(list, name){
  const win = [], log = [];
  for (let i=0; i<list.length; i+=2){
    const a = list[i], b = list[i+1];
    if (a.user || b.user){
      const opp = a.user ? b : a, r = await shootout(opp);
      win.push(r.won ? S.user : opp); log.push(`<li class="me">${S.name} ${r.us}-${r.os} ${opp.name} (penalti) ${r.won?'✅':'❌'}</li>`);
    } else { const r = cpuKO(a,b); win.push(r.w); log.push(`<li>${a.name} ${r.s} ${b.name} → <b>${r.w.name}</b></li>`); }
  }
  await ask(bar(name) + `<div class="pad"><ul class="ko">${log.join('')}</ul><button onclick="_r()">Lanjut</button></div>`);
  return win;
}
async function knockout(){
  const T = S.res.table, po = [];
  for (let i=0; i<8; i++) po.push(T[8+i], T[23-i]);
  const w = await round(po, 'Playoff'), r16 = [];
  for (let i=0; i<8; i++) r16.push(T[i], w[7-i]);
  let cur = await round(r16, '16 Besar');
  cur = await round(cur, 'Perempat Final'); cur = await round(cur, 'Semifinal'); cur = await round(cur, 'Final');
  const ch = cur[0], aw = awards(S.res.teams, ch), you = ch === S.user;
  A.innerHTML = bar('Akhir Musim') + `<div class="pad"><div class="big">${you?'🏆':'🥈'}</div><h3>${you?'KAMU JUARA! ':'Juara: '}${ch.name}</h3>
    <div class="awards"><div><small>GOLDEN BOOT</small><h4>${aw.scorer[0]}</h4><p>${aw.scorer[1]} gol · ${aw.scorer[2]}</p></div><div><small>PLAYMAKER</small><h4>${aw.assist[0]}</h4><p>${aw.assist[1]} assist · ${aw.assist[2]}</p></div><div><small>BEST MANAGER</small><h4>${aw.coach.name}</h4><p>${ch.name}</p></div></div><button onclick="home()">Main Lagi</button></div>`;
}
async function shootout(opp){
  const pool = S.user.xi.filter(p => p.pos!=='GK'), ord = [];
  while (ord.length < 5){
    const i = await ask(bar('Adu Penalti vs '+opp.name) + `<div class="pad"><h3>Pilih penendang ke-${ord.length+1} dari 5</h3><table><tr><th>Pos</th><th>Nama</th><th>PEN</th><th></th></tr>${pool.map((p,i)=>`<tr class="${ord.includes(p)?'sel':''}"><td>${p.pos}</td><td>${p.name}</td><td>${p.pen}</td><td><button class="ghost" onclick="_r(${i})">Pilih</button></td></tr>`).join('')}</table></div>`);
    if (!ord.includes(pool[i])) ord.push(pool[i]);
  }
  const byPen = (a,b) => b.pen-a.pen, uGK = S.user.xi.find(p => p.pos==='GK'), oGK = opp.xi.find(p => p.pos==='GK');
  const seq = [...ord, ...pool.filter(p => !ord.includes(p)).sort(byPen), uGK].filter(Boolean);
  const oo = [...opp.xi.filter(p => p.pos!=='GK').sort(byPen), oGK].filter(Boolean);
  const gu = (uGK ? uGK.gk : 80)/85, go = (oGK ? oGK.gk : 80)/85;
  let us = 0, os = 0, r = 0;
  const TX = [140,200,260], TY = [62,112];
  const scene = (m,c,k) => bar('Penalty Shootout') + `<div class="vs"><span class="me">${S.name}</span><b>${us} - ${os}</b><span>${opp.name}</span></div><p class="rd">Penendang ${r+1}${r>=5?' · sudden death':''}</p>
    <svg viewBox="0 0 400 270" class="pt"><defs><pattern id="net" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H8M0 0V8" stroke="#fff6" stroke-width=".6" fill="none"/></pattern><linearGradient id="st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f323b"/><stop offset="1" stop-color="#868b98"/></linearGradient></defs>
    <rect width="400" height="150" fill="url(#st)"/><rect y="150" width="400" height="120" fill="#3f8f3a"/><path d="M0 190H400M0 232H400" stroke="#47a042" stroke-width="20"/><path d="M20 160H380" stroke="#fff" stroke-width="2"/>
    <rect x="110" y="40" width="180" height="95" fill="url(#net)" stroke="#fff" stroke-width="5"/>
    <g id="gk" fill="#1c1c22" stroke="#1c1c22"><circle cx="200" cy="80" r="7"/><rect x="190" y="88" width="20" height="30" rx="4"/><path d="M190 93L170 108M210 93L230 108" stroke-width="5"/><rect x="192" y="116" width="7" height="18"/><rect x="201" y="116" width="7" height="18"/></g>
    <g fill="#c8102e"><circle cx="140" cy="205" r="8"/><rect x="131" y="213" width="18" height="30" rx="4"/></g><text x="140" y="260">${k}</text>
    <circle id="ball" cx="200" cy="225" r="9" fill="#fff" stroke="#222" stroke-width="1.5"/></svg>
    <p class="msg">${m}</p><div class="ctl">${c}</div>`;
  const zones = `<div class="zones">${['↖','⬆','↗','↙','⬇','↘'].map((t,i)=>`<button onclick="_r(${i})">${t}</button>`).join('')}</div>`;
  const dive = `<button onclick="_r(0)">⬅ Lompat Kiri</button><button onclick="_r(1)">⬆ Tengah</button><button onclick="_r(2)">Lompat Kanan ➡</button>`;
  const shot = async (res, z, dv, k, msg) => {
    const side = z%3, row = z<3?0:1;
    A.innerHTML = scene('', '', k); await wait(80);
    let dx = TX[side]-200, dy = TY[row]-225;
    if (res==='miss'){ if (rnd(2)) { dx = (side===2?1:side===0?-1:(rnd(2)?1:-1))*108; } else dy = -212; }
    $('#ball').style.transform = `translate(${dx}px,${dy}px) scale(.55)`;
    $('#gk').style.transform = `translate(${(dv-1)*55}px,${dv===1?-8:6}px) rotate(${(dv-1)*65}deg)`;
    await wait(850); $('.msg').textContent = msg; await wait(1250);
  };
  const done = after => { const ru = 4-r, ro = after ? 4-r : 5-r; return r<5 ? (us>os+ro || os>us+ru) : (after && us!==os); };
  while (true){
    const k = seq[r%seq.length], z = await ask(scene(`Penendang ke-${r+1}: ${k.name} (PEN ${k.pen}). Pilih arah!`, zones, k.name)), side = z%3;
    const pw = await ask(scene('Tekan TENDANG saat bar di zona hijau!', `<div class="power"><i id="pb"></i><u></u></div><button onclick="_r(P.v)">TENDANG</button>`, k.name), () => {
      let t = 0; P.v = 0; P.t = setInterval(() => { t += 0.05; P.v = Math.abs(Math.sin(t)); $('#pb').style.width = P.v*100+'%'; }, 20); });
    clearInterval(P.t);
    let dv = [0,0,1,2,2][rnd(5)];
    const res = Math.random() < (pw>0.93 ? 0.85 : (100-k.pen)/350) ? 'miss' : (dv===side && Math.random() < Math.min(.95,(pw<.35?.9:pw<.7?.65:.4)*(z<3?.8:1)*go)) ? 'save' : 'goal';
    if (res==='save') dv = side; else if (dv===side) dv = (side+1+rnd(2))%3;
    if (res==='goal') us++;
    await shot(res, z, dv, k.name, res==='goal'?'⚽ GOL!':res==='save'?'🧤 Ditepis kiper!':'❌ Melebar/melambung!');
    if (done(false)) break;
    const ok = oo[r%oo.length], d = await ask(scene(`${ok.name} (PEN ${ok.pen}) akan menendang. Antisipasi!`, dive, ok.name));
    const cz = rnd(6), cs = cz%3;
    const o = Math.random() < (100-ok.pen)/350 ? 'miss' : (d===cs && Math.random()<Math.min(.95,.75*gu)) ? 'save' : 'goal';
    if (o==='goal') os++;
    await shot(o, cz, d, ok.name, o==='goal'?'😬 Lawan mencetak gol':o==='save'?'🧤 TEPISAN! Kamu menyelamatkan!':'🙌 Lawan gagal!');
    if (done(true)) break;
    r++;
  }
  return {won: us>os, us, os};
}
home();
