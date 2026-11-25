// RED THROUGH TIME - pemain era 1990-an (yang ada di skuad 1990/91 sampai debut 1999/00)
// Format: [nama, posisi, nomor, rating, dari, sampai, cek]
// posisi: GK, CB, RB, LB, DM, CM, AM, LW, RW, SS, CF
// dari/sampai = tahun awal musim (1998 = musim 1998/99)
// cek = 1 artinya nomor punggung belum yakin, perlu diperiksa
window.RTT = window.RTT || {};
RTT.players = RTT.players || [];

RTT.players.push(
  // Kiper
  ["Bruce Grobbelaar",   "GK",  1, 80, 1981, 1993],
  ["Mike Hooper",        "GK", 13, 66, 1985, 1991, 1],
  ["David James",        "GK",  1, 81, 1992, 1998],
  ["Brad Friedel",       "GK", 13, 76, 1997, 1999, 1],
  ["Sander Westerveld",  "GK",  1, 76, 1999, 2000],

  // Bek
  ["Alan Hansen",        "CB",  6, 86, 1977, 1990],
  ["Gary Gillespie",     "CB",  5, 74, 1983, 1990, 1],
  ["Glenn Hysén",        "CB",  3, 78, 1989, 1991, 1],
  ["Gary Ablett",        "CB",  4, 72, 1986, 1991, 1],
  ["Mark Wright",        "CB",  5, 79, 1991, 1997, 1],
  ["Neil Ruddock",       "CB", 15, 74, 1993, 1997, 1],
  ["Phil Babb",          "CB",  6, 73, 1994, 1999],
  ["John Scales",        "CB",  4, 74, 1994, 1995, 1],
  ["Dominic Matteo",     "CB", 12, 74, 1992, 1999, 1],
  ["Torben Piechnik",    "CB", 20, 62, 1992, 1993, 1],
  ["Jamie Carragher",    "CB", 23, 90, 1996, 2012],
  ["Sami Hyypiä",        "CB",  4, 91, 1999, 2008],
  ["Stéphane Henchoz",   "CB",  2, 82, 1999, 2004],
  ["Rigobert Song",      "CB", 12, 66, 1999, 1999, 1],
  ["Steve Nicol",        "RB",  2, 80, 1981, 1993],
  ["Barry Venison",      "RB", 12, 70, 1986, 1991, 1],
  ["Rob Jones",          "RB",  2, 80, 1991, 1997],
  ["Jason McAteer",      "RB", 11, 73, 1995, 1998, 1],
  ["Vegard Heggem",      "RB", 14, 72, 1998, 2001, 1],
  ["David Burrows",      "LB",  3, 68, 1988, 1992, 1],
  ["Julian Dicks",       "LB",  3, 76, 1993, 1993, 1],
  ["Stig Inge Bjørnebye","LB",  4, 74, 1992, 1998, 1],
  ["Steve Harkness",     "LB", 14, 64, 1989, 1998, 1],

  // Gelandang
  ["Steve McMahon",      "CM", 11, 77, 1985, 1990, 1],
  ["Jan Mølby",          "CM", 16, 79, 1984, 1994, 1],
  ["Ronnie Whelan",      "CM",  5, 76, 1979, 1993, 1],
  ["Ray Houghton",       "CM",  8, 76, 1987, 1991, 1],
  ["Mike Marsh",         "CM", 14, 66, 1989, 1992, 1],
  ["Nigel Spackman",     "DM",  8, 68, 1989, 1991, 1],
  ["Don Hutchison",      "CM", 14, 68, 1990, 1993, 1],
  ["Istvan Kozma",       "AM", 12, 62, 1992, 1992, 1],
  ["Paul Stewart",       "CM",  8, 70, 1992, 1994, 1],
  ["Michael Thomas",     "CM",  7, 74, 1991, 1997, 1],
  ["Jamie Redknapp",     "CM", 11, 82, 1991, 2001, 1],
  ["Paul Ince",          "DM",  8, 80, 1997, 1998, 1],
  ["Øyvind Leonhardsen", "CM", 20, 72, 1997, 1998, 1],
  ["David Thompson",     "CM", 14, 68, 1996, 1998, 1],
  ["Danny Murphy",       "CM", 22, 78, 1997, 2003, 1],
  ["Patrik Berger",      "CM", 16, 82, 1996, 2002, 1],
  ["Dietmar Hamann",     "DM", 16, 84, 1999, 2005],
  ["Steven Gerrard",     "CM",  8, 98, 1998, 2014],

  // Sayap dan penyerang pendukung
  ["John Barnes",        "LW", 10, 90, 1987, 1996],
  ["Mark Walters",       "LW", 12, 72, 1991, 1995, 1],
  ["Mark Kennedy",       "LW", 19, 68, 1995, 1997, 1],
  ["Steve McManaman",    "RW", 17, 88, 1990, 1998],
  ["Vladimir Šmicer",    "RW",  7, 78, 1999, 2004, 1],
  ["Peter Beardsley",    "SS",  7, 87, 1987, 1990, 1],
  ["Nigel Clough",       "SS", 10, 73, 1993, 1995, 1],

  // Penyerang tengah
  ["Ian Rush",           "CF",  9, 88, 1980, 1995],
  ["Dean Saunders",      "CF",  9, 78, 1991, 1991, 1],
  ["Robbie Fowler",      "CF",  9, 92, 1993, 2000, 1],
  ["Stan Collymore",     "CF",  8, 82, 1995, 1996, 1],
  ["Michael Owen",       "CF", 10, 93, 1996, 2003],
  ["Karlheinz Riedle",   "CF",  9, 80, 1997, 1998, 1],
  ["Titi Camara",        "CF", 18, 74, 1999, 1999, 1],
  ["Erik Meijer",        "CF", 20, 66, 1999, 1999, 1],
  ["Lee Jones",          "CF", 30, 62, 1995, 1996, 1]
);
