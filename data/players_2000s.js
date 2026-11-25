// RED THROUGH TIME - pemain era 2000-an (debut 2000/01 sampai 2009/10)
// Format: [nama, posisi, nomor, rating, dari, sampai, cek]
// posisi: GK, CB, RB, LB, DM, CM, AM, LW, RW, SS, CF
// dari/sampai = tahun awal musim (2004 = musim 2004/05)
// cek = 1 artinya nomor punggung belum yakin, perlu diperiksa
window.RTT = window.RTT || {};
RTT.players = RTT.players || [];

RTT.players.push(
  // Kiper
  ["Jerzy Dudek",         "GK",  1, 82, 2001, 2006],
  ["Chris Kirkland",      "GK", 13, 68, 2001, 2004],
  ["Pepe Reina",          "GK", 25, 88, 2005, 2012],

  // Bek
  ["Daniel Agger",        "CB",  5, 84, 2006, 2013],
  ["Martin Škrtel",       "CB", 37, 80, 2008, 2014],
  ["Markus Babbel",       "RB",  6, 76, 2000, 2003],
  ["Steve Finnan",        "RB",  3, 80, 2003, 2007],
  ["Álvaro Arbeloa",      "RB", 17, 76, 2007, 2008],
  ["Philipp Degen",       "RB", 12, 66, 2008, 2009],
  ["Glen Johnson",        "RB",  2, 80, 2009, 2014],
  ["Djimi Traoré",        "LB", 23, 65, 1999, 2005],
  ["John Arne Riise",     "LB",  6, 80, 2001, 2007],
  ["Fábio Aurélio",       "LB", 10, 72, 2006, 2010],
  ["Andrea Dossena",      "LB", 33, 66, 2008, 2009],
  ["Emiliano Insúa",      "LB", 35, 64, 2008, 2009],

  // Gelandang
  ["Gary McAllister",     "CM", 11, 80, 2000, 2001],
  ["Igor Bišćan",         "DM", 12, 70, 2000, 2003],
  ["Salif Diao",          "DM", 15, 65, 2002, 2004],
  ["Momo Sissoko",        "DM", 19, 74, 2005, 2007],
  ["Javier Mascherano",   "DM", 20, 86, 2007, 2009],
  ["Lucas Leiva",         "DM", 21, 80, 2007, 2015],
  ["Xabi Alonso",         "CM", 14, 90, 2004, 2008],
  ["Alberto Aquilani",    "CM",  4, 72, 2009, 2009],
  ["Jari Litmanen",       "AM", 37, 75, 2001, 2001],
  ["Bruno Cheyrou",       "AM", 22, 62, 2002, 2003],
  ["Luis García",         "AM", 10, 82, 2004, 2006],
  ["Yossi Benayoun",      "AM", 15, 78, 2007, 2009],

  // Sayap
  ["Nick Barmby",         "RW", 11, 72, 2000, 2001],
  ["Harry Kewell",        "LW",  7, 78, 2003, 2007],
  ["Bolo Zenden",         "LW",  8, 76, 2005, 2006],
  ["Jermaine Pennant",    "RW", 28, 72, 2006, 2007],
  ["Mark González",       "RW", 11, 66, 2006, 2007],
  ["Dirk Kuyt",           "RW", 18, 84, 2006, 2011],
  ["Ryan Babel",          "LW", 19, 76, 2007, 2010],
  ["Albert Riera",        "LW", 24, 74, 2008, 2009],

  // Penyerang
  ["Emile Heskey",        "CF",  8, 76, 2000, 2003],
  ["El-Hadji Diouf",      "RW",  9, 72, 2002, 2003],
  ["Milan Baroš",         "CF",  5, 76, 2002, 2004],
  ["Neil Mellor",         "CF", 30, 62, 2002, 2004],
  ["Florent Sinama Pongolle","CF",17, 68, 2003, 2005],
  ["Peter Crouch",        "CF", 15, 78, 2005, 2007],
  ["Craig Bellamy",       "CF", 10, 76, 2006, 2006],
  ["Andriy Voronin",      "CF",  9, 66, 2007, 2008],
  ["Fernando Torres",     "CF",  9, 95, 2007, 2010],
  ["Robbie Keane",        "SS",  7, 76, 2008, 2008]
);
