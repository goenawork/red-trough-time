// RED THROUGH TIME - data pelatih
// Format: [nama, formasi, rating, dari, sampai]
// dari/sampai = tahun awal musim (1990 = musim 1990/91)
window.RTT = window.RTT || {};

RTT.coaches = [
  ["Kenny Dalglish",  "4-4-2",   88, 1990, 1990],
  ["Graeme Souness",  "4-4-2",   70, 1991, 1993],
  ["Roy Evans",       "3-5-2",   80, 1994, 1997],
  ["Gérard Houllier", "4-4-2",   88, 1998, 2003],
  ["Rafael Benítez",  "4-2-3-1", 90, 2004, 2009],
  ["Roy Hodgson",     "4-4-2",   62, 2010, 2010],
  ["Kenny Dalglish",  "4-4-2",   80, 2011, 2011],
  ["Brendan Rodgers", "4-3-3",   84, 2012, 2014],
  ["Jürgen Klopp",    "4-3-3",   95, 2015, 2023],
  ["Arne Slot",       "4-2-3-1", 90, 2024, 2025],
  ["Andoni Iraola",   "4-2-3-1", 70, 2026, 2026]
];

// Skuad yang pernah juara: dapat bonus kekuatan (susah dikalahkan)
// Format: [tahun awal musim, kompetisi]
RTT.champions = [
  [2004, "UCL"],
  [2018, "UCL"],
  [2019, "PL"],
  [2024, "PL"]
];
