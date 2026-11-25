// RED THROUGH TIME - pemain era 2020-an (debut 2019/20 akhir sampai skuad 2026/27)
// Format: [nama, posisi, nomor, rating, dari, sampai, cek]
// posisi: GK, CB, RB, LB, DM, CM, AM, LW, RW, SS, CF
// dari/sampai = tahun awal musim (2025 = musim 2025/26)
// cek = 1 artinya nomor punggung belum yakin, perlu diperiksa
window.RTT = window.RTT || {};
RTT.players = RTT.players || [];

RTT.players.push(
  // Kiper
  ["Caoimhín Kelleher",    "GK", 62, 74, 2019, 2024],
  ["Giorgi Mamardashvili", "GK", 25, 82, 2025, 2026],
  ["Vítězslav Jaroš",      "GK", 20, 62, 2020, 2026],
  ["Freddie Woodman",      "GK", 28, 60, 2025, 2026],

  // Bek
  ["Ibrahima Konaté",      "CB",  5, 84, 2021, 2025],
  ["Jarell Quansah",       "CB", 78, 72, 2022, 2024],
  ["Giovanni Leoni",       "CB", 15, 68, 2025, 2026],
  ["Jérémy Jacquet",       "CB",  3, 74, 2026, 2026],
  ["Luke Chambers",        "CB",  5, 62, 2022, 2026],
  ["Neco Williams",        "RB", 76, 68, 2019, 2020],
  ["Conor Bradley",        "RB", 12, 78, 2022, 2026],
  ["Jeremie Frimpong",     "RB", 30, 80, 2025, 2026],
  ["Kostas Tsimikas",      "LB", 21, 72, 2020, 2025],
  ["Milos Kerkez",         "LB",  6, 76, 2025, 2026],

  // Gelandang
  ["Wataru Endo",          "DM",  3, 72, 2023, 2026],
  ["Ryan Gravenberch",     "DM", 38, 85, 2023, 2026],
  ["Thiago Alcântara",     "CM",  6, 92, 2020, 2023],
  ["Curtis Jones",         "CM", 17, 78, 2019, 2025],
  ["Alexis Mac Allister",  "CM", 10, 87, 2023, 2026],
  ["Dominik Szoboszlai",   "AM",  8, 86, 2023, 2026],
  ["Florian Wirtz",        "AM",  7, 94, 2025, 2026],

  // Sayap
  ["Harvey Elliott",       "RW", 19, 74, 2019, 2024],
  ["Luis Díaz",            "LW",  7, 86, 2021, 2024],
  ["Cody Gakpo",           "LW", 18, 82, 2022, 2026],
  ["Federico Chiesa",      "RW", 14, 76, 2024, 2026],
  ["Rio Ngumoha",          "LW", 73, 70, 2025, 2026],
  ["Kaide Gordon",         "RW", 16, 66, 2020, 2026],
  ["Víctor Muñoz",         "RW", 23, 74, 2026, 2026],

  // Penyerang
  ["Diogo Jota",           "CF", 20, 87, 2020, 2024],
  ["Darwin Núñez",         "CF", 27, 77, 2022, 2024],
  ["Hugo Ekitike",         "CF", 22, 83, 2025, 2026],
  ["Alexander Isak",       "CF",  9, 86, 2025, 2026]
);
