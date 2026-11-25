// RED THROUGH TIME - pemain era 2010-an (debut 2010/11 sampai 2019/20)
// Format: [nama, posisi, nomor, rating, dari, sampai, cek]
// posisi: GK, CB, RB, LB, DM, CM, AM, LW, RW, SS, CF
// dari/sampai = tahun awal musim (2018 = musim 2018/19)
// cek = 1 artinya nomor punggung belum yakin, perlu diperiksa
window.RTT = window.RTT || {};
RTT.players = RTT.players || [];

RTT.players.push(
  // Kiper
  ["Simon Mignolet",        "GK", 22, 75, 2013, 2017],
  ["Loris Karius",          "GK",  1, 62, 2016, 2017, 1],
  ["Alisson Becker",        "GK",  1, 93, 2018, 2026],

  // Bek
  ["Sebastián Coates",      "CB", 16, 62, 2011, 2013, 1],
  ["Kolo Touré",            "CB", 4,  70, 2013, 2014],
  ["Mamadou Sakho",         "CB", 17, 74, 2013, 2015],
  ["Dejan Lovren",          "CB",  6, 77, 2014, 2019],
  ["Ragnar Klavan",         "CB", 12, 70, 2016, 2018, 1],
  ["Joël Matip",            "CB", 32, 80, 2016, 2023],
  ["Virgil van Dijk",       "CB",  4, 95, 2017, 2026],
  ["Joe Gomez",             "CB", 12, 78, 2015, 2026, 1],
  ["Nathaniel Clyne",       "RB",  2, 76, 2015, 2018],
  ["Trent Alexander-Arnold","RB", 66, 92, 2016, 2024],
  ["José Enrique",          "LB", 3,  72, 2011, 2013, 1],
  ["Alberto Moreno",        "LB", 18, 74, 2014, 2018],
  ["Andy Robertson",        "LB", 26, 90, 2017, 2025],

  // Gelandang
  ["Raul Meireles",         "CM", 4,  80, 2010, 2010, 1],
  ["Christian Poulsen",     "DM", 5,  66, 2010, 2010, 1],
  ["Charlie Adam",          "CM", 26, 70, 2011, 2011],
  ["Jordan Henderson",      "CM", 14, 82, 2011, 2022],
  ["Joe Allen",             "CM", 24, 74, 2012, 2015],
  ["Emre Can",              "CM", 23, 79, 2014, 2017],
  ["James Milner",          "CM",  7, 80, 2015, 2022],
  ["Georginio Wijnaldum",   "CM",  5, 84, 2016, 2020],
  ["Alex Oxlade-Chamberlain","CM",15, 76, 2017, 2022, 1],
  ["Fabinho",               "DM",  3, 88, 2018, 2022],
  ["Naby Keïta",            "CM",  8, 76, 2018, 2022],
  ["Adam Lallana",          "AM", 20, 80, 2014, 2019],
  ["Philippe Coutinho",     "AM", 10, 88, 2013, 2017],
  ["Takumi Minamino",       "AM", 18, 70, 2019, 2021, 1],

  // Sayap
  ["Joe Cole",              "LW", 10, 70, 2010, 2010, 1],
  ["Stewart Downing",       "LW", 19, 70, 2011, 2012, 1],
  ["Raheem Sterling",       "RW",  7, 82, 2012, 2014, 1],
  ["Jordon Ibe",            "RW", 33, 66, 2014, 2015, 1],
  ["Xherdan Shaqiri",       "RW", 23, 72, 2018, 2020],
  ["Sadio Mané",            "LW", 10, 92, 2016, 2021],
  ["Mohamed Salah",         "RW", 11, 97, 2017, 2025],

  // Penyerang
  ["Luis Suárez",           "CF",  7, 94, 2010, 2013],
  ["Andy Carroll",          "CF",  9, 72, 2010, 2011],
  ["Fabio Borini",          "CF", 29, 68, 2012, 2013],
  ["Daniel Sturridge",      "CF", 15, 85, 2012, 2018],
  ["Divock Origi",          "CF", 27, 76, 2014, 2021],
  ["Roberto Firmino",       "SS",  9, 89, 2015, 2022]
);
