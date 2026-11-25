// RED THROUGH TIME - mesin game (gacha + simulasi liga)
const GRP = {GK:'GK',CB:'DF',RB:'DF',LB:'DF',DM:'MF',CM:'MF',AM:'MF',LW:'ST',RW:'ST',SS:'ST',CF:'ST'};
const FORM = {
  "4-4-2":  ["GK","RB","CB","CB","LB","MF","MF","MF","MF","ST","ST"],
  "4-3-3":  ["GK","RB","CB","CB","LB","MF","MF","MF","ST","ST","ST"],
  "4-2-3-1":["GK","RB","CB","CB","LB","MF","MF","MF","MF","MF","ST"],
  "3-5-2":  ["GK","CB","CB","CB","MF","MF","MF","MF","MF","ST","ST"]
};
const penOf = (pos,r) => Math.min(99, GRP[pos]==='ST'?r : GRP[pos]==='MF'?r-2 : GRP[pos]==='DF'?r-10 : 55+Math.round((r-60)*.3));
const PLAYERS = RTT.players.map(a => ({name:a[0], pos:a[1], num:a[2], rating:a[3], from:a[4], to:a[5], chk:a[6]||0, grp:GRP[a[1]], pen:penOf(a[1],a[3]), gk:a[1]==='GK'?Math.min(99,a[3]+3):0}));
const COACHES = RTT.coaches.map(a => ({name:a[0], formation:a[1], rating:a[2], from:a[3], to:a[4]}));
const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { for (let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
const tier = r => r>=92?'legend':r>=86?'epic':r>=78?'rare':'common';
const weight = r => r>=92?0.15:r>=86?0.35:r>=78?0.7:1;

function pick(list){
  const w = list.map(x => weight(x.rating)), t = w.reduce((a,b)=>a+b,0);
  let r = Math.random()*t;
  for (let i=0;i<list.length;i++){ r -= w[i]; if (r<=0) return list[i]; }
  return list[list.length-1];
}
const drawCoach = () => pick(COACHES);
const fits = (slot,p) => ['GK','RB','CB','LB'].includes(slot) ? p.pos===slot : p.grp===slot;
const drawPlayer = (slot,taken) => pick(PLAYERS.filter(p => fits(slot,p) && !taken.includes(p)));

const strength = (xi, coach, bonus=0) => 0.85*xi.reduce((a,p)=>a+p.rating,0)/xi.length + 0.15*coach.rating + bonus;
const seasonLabel = s => `Liverpool ${String(s).slice(2)}/${String(s+1).slice(2)}`;

function seasonTeam(s){
  const roster = PLAYERS.filter(p => p.from<=s && s<=p.to).sort((a,b)=>b.rating-a.rating);
  const gk = roster.find(p => p.pos==='GK');
  const xi = (gk?[gk]:[]).concat(roster.filter(p => p!==gk).slice(0, gk?10:11));
  const coach = COACHES.find(c => c.from<=s && s<=c.to);
  const champ = RTT.champions.some(c => c[0]===s);
  return {name:seasonLabel(s), xi, coach, champ, strength:strength(xi, coach, champ?8:0), user:false, st:{}};
}

const poisson = l => { let L=Math.exp(-l), k=0, p=1; do { k++; p*=Math.random(); } while (p>L); return k-1; };
function scorer(team, kind){
  const base = kind==='goal' ? {GK:0,DF:0.1,MF:0.45,ST:1} : {GK:0,DF:0.3,MF:1,ST:0.6};
  const w = team.xi.map(p => base[p.grp]*Math.pow(p.rating/80,3)), t = w.reduce((a,b)=>a+b,0);
  let r = Math.random()*t;
  for (let i=0;i<w.length;i++){ r -= w[i]; if (r<=0) return team.xi[i]; }
  return team.xi[team.xi.length-1];
}
function addStat(team, p, key){ const s = team.st[p.name] = team.st[p.name] || {g:0,a:0}; s[key]++; }
function goalsFor(team, n){
  for (let i=0;i<n;i++){
    const g = scorer(team,'goal'); addStat(team,g,'g');
    if (Math.random()<0.75){ let a = scorer(team,'assist'); if (a!==g) addStat(team,a,'a'); }
  }
}
function playMatch(h, a){
  const gh = poisson(1.5*Math.exp((h.strength+3-a.strength)/25));
  const ga = poisson(1.2*Math.exp((a.strength-h.strength-3)/25));
  goalsFor(h,gh); goalsFor(a,ga);
  return [gh, ga];
}

function pairRound(ids, played){
  for (let tries=0; tries<400; tries++){
    const s = shuffle(ids.slice()), pairs = [];
    let ok = true;
    for (let i=0;i<s.length;i+=2){
      if (played.has(s[i]+'-'+s[i+1])){ ok=false; break; }
      pairs.push([s[i], s[i+1]]);
    }
    if (ok) return pairs;
  }
  return null;
}

// user = {name, xi, coach}; hasil: {teams, matches, table}
function runLeague(user){
  const seasons = shuffle(Array.from({length:37},(_,i)=>1990+i)).slice(0,23);
  const teams = [{name:user.name, xi:user.xi, coach:user.coach, strength:strength(user.xi,user.coach), user:true, st:{}}]
    .concat(seasons.map(seasonTeam));
  teams.forEach((t,i)=>{ t.id=i; t.pts=0; t.gf=0; t.ga=0; t.w=0; t.d=0; t.l=0; });
  const matches = [], ids = teams.map(t=>t.id);
  let played = new Set(), round = 0;
  while (round<8){
    const pairs = pairRound(ids, played);
    if (!pairs){ played = new Set(); round = 0; matches.length = 0; teams.forEach(t=>{t.pts=t.gf=t.ga=t.w=t.d=t.l=0; t.st={};}); continue; }
    pairs.forEach(([x,y]) => {
      played.add(x+'-'+y); played.add(y+'-'+x);
      const [h,a] = Math.random()<0.5 ? [teams[x],teams[y]] : [teams[y],teams[x]];
      const [gh,ga] = playMatch(h,a);
      h.gf+=gh; h.ga+=ga; a.gf+=ga; a.ga+=gh;
      if (gh>ga){h.pts+=3;h.w++;a.l++;} else if (gh<ga){a.pts+=3;a.w++;h.l++;} else {h.pts++;a.pts++;h.d++;a.d++;}
      matches.push({round:round+1, h:h.id, a:a.id, gh, ga});
    });
    round++;
  }
  const table = teams.slice().sort((p,q) => q.pts-p.pts || (q.gf-q.ga)-(p.gf-p.ga) || q.gf-p.gf);
  return {teams, matches, table};
}

// ---- Knockout & penghargaan ----
function cpuKO(a,b){
  const [x,y]=playMatch(a,b);
  if(x!==y) return {w:x>y?a:b, s:x+'-'+y};
  const w=Math.random()<1/(1+Math.exp((b.strength-a.strength)/30));
  return {w:w?a:b, s:x+'-'+y+' (pen)'};
}
function awards(teams,champ){
  const sc=[],as=[];
  teams.forEach(t=>Object.entries(t.st).forEach(([n,s])=>{sc.push([n,s.g,t.name]);as.push([n,s.a,t.name]);}));
  const top=l=>l.sort((a,b)=>b[1]-a[1])[0];
  return {scorer:top(sc), assist:top(as), coach:champ.coach};
}
