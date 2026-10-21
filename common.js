/* The Case of the Disappearing Penny: shared data, palette and coin renderer.
   Every figure below is transcribed from the uploaded case files:
   Roman_Silver_Data.xlsx, Celtic_Coins.csv, Ptolemaic_Bronze_Post_205.xlsx,
   Tudor_Silver.csv, Macro_US_Data.xlsx. */
(function (global) {
  const PAL = {
    fine: "#E4E6E8", worn: "#AEB4B7", billon: "#8A8D7E", bronze: "#A86B3C", verdigris: "#3F7A6B",
    paper: "#EFE4CC", brass: "#B98B2E", red: "#8C2F2B", slate: "#4A5560", ink: "#1F2A2E",
    gold: "#D2A93E", copper: "#B4683A", zinc: "#9BA3A6"
  };

  // Series colours tuned for the dark evidence-room ground.
  // Series colours for the dark bronze ground. Mood-board hues; bronze, verdigris and red string
  // are lifted slightly in lightness so lines stay legible on brown.
  const SERIES = {
    rome:   { name: "Rome",       full: "Roman denarius & antoninianus", color: "#E4E6E8" },
    celtic: { name: "Britain",    full: "Celtic gold staters",           color: "#D2A93E" },
    ptol:   { name: "Alexandria", full: "Ptolemaic bronze",              color: "#C98450" },
    tudor:  { name: "London",     full: "Tudor silver penny",            color: "#5FA08E" },
    us:     { name: "Washington", full: "US dollar (CPI-U)",             color: "#C9524A" }
  };

  /* ---------- ROME ---------- */
  // D.R. Walker, The Metrology of the Roman Silver Coinage (1976-78), XRF surface analysis.
  const romeWalker = [
    { s: -27, e: 14,  ruler: "Augustus", wg: 3.89, pct: 98, ag: 3.81, note: "Denarius standardized near start of Principate" },
    { s: 14,  e: 68,  ruler: "Tiberius to Nero (early)", wg: 3.89, pct: 97, ag: 3.77, note: "Purity roughly stable through Julio-Claudians" },
    { s: 64,  e: 68,  ruler: "Nero (post-reform)", wg: 3.18, pct: 93.5, ag: 2.97, note: "Nero reduced weight c. AD 64; first major reform" },
    { s: 70,  e: 81,  ruler: "Vespasian to Titus", wg: 3.22, pct: 90, ag: 2.90 },
    { s: 82,  e: 85,  ruler: "Domitian (reform)", wg: 3.33, pct: 98, ag: 3.27, note: "Domitian briefly restored high purity" },
    { s: 85,  e: 107, ruler: "Domitian (later) to Trajan (early)", wg: 3.27, pct: 93.5, ag: 3.06 },
    { s: 107, e: 148, ruler: "Trajan to Hadrian", wg: 3.21, pct: 89, ag: 2.86 },
    { s: 148, e: 161, ruler: "Antoninus Pius", wg: 3.23, pct: 83.5, ag: 2.70 },
    { s: 161, e: 168, ruler: "Marcus Aurelius (early)", wg: 3.23, pct: 79, ag: 2.55, note: "Co-reign with Lucius Verus; Parthian war and plague costs" },
    { s: 168, e: 170, ruler: "Marcus Aurelius (mid)", wg: 3.24, pct: 82, ag: 2.66 },
    { s: 170, e: 180, ruler: "Marcus Aurelius (late)", wg: 3.26, pct: 79, ag: 2.57, note: "Marcomannic Wars strain finances" },
    { s: 180, e: 185, ruler: "Commodus (early)", wg: 3.07, pct: 76, ag: 2.34 },
    { s: 186, e: 192, ruler: "Commodus (late)", wg: 2.98, pct: 74, ag: 2.20 },
    { s: 193, e: 193, ruler: "Pertinax", wg: 3.16, pct: 87, ag: 2.75, note: "Brief reign; attempted stabilization" },
    { s: 193, e: 193, ruler: "Didius Julianus", wg: 2.95, pct: 81.5, ag: 2.40, note: "Bought the throne at auction" },
    { s: 193, e: 194, ruler: "Septimius Severus (early)", wg: 3.14, pct: 78.5, ag: 2.47 },
    { s: 194, e: 196, ruler: "Septimius Severus (mid)", wg: 3.07, pct: 64.5, ag: 1.98 },
    { s: 196, e: 211, ruler: "Septimius Severus (late)", wg: 3.22, pct: 56.5, ag: 1.82, note: "Steep debasement to fund army pay raises" },
    { s: 212, e: 217, ruler: "Caracalla", wg: 3.23, pct: 51.5, ag: 1.66, note: "Introduced the antoninianus (double denarius) in 215" },
    { s: 217, e: 218, ruler: "Macrinus", wg: 3.15, pct: 58, ag: 1.83, note: "Brief attempt to raise standard" },
    { s: 219, e: 222, ruler: "Elagabalus", wg: 3.05, pct: 46.5, ag: 1.42, note: "Demonetized the antoninianus in 219" },
    { s: 222, e: 228, ruler: "Severus Alexander (early)", wg: 3.00, pct: 43, ag: 1.29 },
    { s: 229, e: 230, ruler: "Severus Alexander (mid)", wg: 3.24, pct: 45, ag: 1.46 },
    { s: 230, e: 235, ruler: "Severus Alexander (late)", wg: 2.94, pct: 50.5, ag: 1.49 },
    { s: 235, e: 238, ruler: "Maximinus I Thrax", wg: 3.07, pct: 46, ag: 1.41, note: "First soldier-emperor; start of the Crisis of the Third Century" },
    { s: 238, e: 238, ruler: "Gordian I & II", wg: 2.77, pct: 63, ag: 1.75, note: "Joint reign of weeks" },
    { s: 238, e: 238, ruler: "Pupienus & Balbinus", wg: 2.80, pct: 55, ag: 1.54, note: "Revived the antoninianus" },
    { s: 241, e: 241, ruler: "Gordian III", wg: 3.03, pct: 48, ag: 1.45 },
    { s: 253, e: 260, ruler: "Valerian & Gallienus", pct: 17.5, lo: 15, hi: 20, approx: true, note: "Recorded as 15-20%. Rapid collapse of denarius/antoninianus fineness" },
    { s: 260, e: 268, ruler: "Gallienus (sole reign)", pct: 5, approx: true, note: "Coins effectively bronze with a thin silver wash" },
    { s: 268, e: 270, ruler: "Claudius II Gothicus", pct: 3, lo: 2, hi: 4, approx: true, note: "Recorded as 2 or 4%. Antoninianus nearly base metal" },
    { s: 270, e: 275, ruler: "Aurelian (pre-reform)", pct: 3, lo: 2, hi: 4, approx: true, note: "Recorded as 2 or 4%. Currency crisis near its worst" },
    { s: 274, e: 275, ruler: "Aurelian (reform)", pct: 5, approx: true, note: "Marked XXI: a fixed nominal ratio, not restored silver" },
    { s: 284, e: 301, ruler: "Diocletian era", pct: 5, approx: true, note: "About 5% or less. Led to the Edict on Maximum Prices (301)" }
  ];
  romeWalker.forEach(d => { d.mid = (d.s + d.e) / 2; });

  // Butcher & Ponting 2005 (OJA 24.2), AAS/ICP-AES on drilled samples. Only rows the sheet credits to them.
  const romeBP = [
    { s: -27, e: 63, ruler: "Augustus to Nero (pre-reform)", pct: 99, lo: 98, hi: 100, method: "AAS/ICP-AES", note: "Pure silver bullion, 100% in Roman terms" },
    { s: 64, e: 66, ruler: "Nero (post-reform I)", pct: 97, method: "AAS/ICP-AES", note: "Still near pre-reform fineness despite a ~25% cut in silver content from the weight reduction" },
    { s: 66, e: 68, ruler: "Nero (post-reform II)", pct: 80, method: "AAS/ICP-AES", note: "Fineness lowered to about 80%" },
    { s: 68, e: 68, ruler: "Nero (reform of 68)", pct: 90, method: "AAS/ICP-AES", note: "Little-known second reform raised fineness back to ~90%" },
    { s: 68, e: 69, ruler: "Galba", pct: 90.5, lo: 83, hi: 98, method: "AAS/ICP-AES", note: "Mint-dependent: Rome lower, Spain/Lugdunum purer" },
    { s: 69, e: 69, ruler: "Otho", pct: 86.5, lo: 83, hi: 90, method: "AAS/ICP-AES" },
    { s: 79, e: 81, ruler: "Titus", pct: 80, method: "Mixed", note: "Standard inherited by Domitian" },
    { s: 81, e: 82, ruler: "Domitian (early)", pct: 80, method: "Mixed" },
    { s: 82, e: 85, ruler: "Domitian (reform of 82)", pct: 100, method: "Mixed", note: "Raised to nearly 100%" },
    { s: 85, e: 96, ruler: "Domitian (post-85) & Nerva", pct: 90, method: "Mixed", note: "Cut back to ~90% in mid-85" },
    { s: 194, e: 211, ruler: "Septimius Severus (standardized)", pct: 46.4, lo: 46, hi: 46.8, method: "AAS on drilled samples (per sheet notes)", note: "83 denarii + 21 cast + 36 provincial tetradrachms analysed" },
    { s: 260, e: 270, ruler: "Gallienus to Claudius II", pct: 3.5, lo: 2, hi: 5, method: "Estimate", note: "Bronze with a thin silver wash" }
  ];
  romeBP.forEach(d => { d.mid = (d.s + d.e) / 2; });

  /* ---------- CELTIC BRITAIN ---------- */
  // Van Arsdell, Celtic Coinage of Britain (3rd ed. online), Manufacturing Methods p.2
  const celtic = [
    { id: 1, year: -125, label: "c. 125 BC", series: "Gallo-Belgic A/B", type: "Large Flan & Defaced Die staters", wt: 7.8, au: 75, ag: 22, cu: 3, conf: "Medium", method: "Electron microprobe", qual: "approx. series average", note: "Close to natural gold plus a little copper" },
    { id: 2, year: -100, label: "c. 100 BC", series: "Gallo-Belgic C", type: "Abstract Design staters", wt: 7.25, au: 70, ag: 25, cu: null, conf: "Medium", method: "Electron microprobe", qual: "Au upper bound; Ag lower bound", note: "Gold under 70%, silver over 25%; copper roughly constant, no figure" },
    { id: 3, year: -75, label: "c. 75 BC", series: "Gallo-Belgic C (later)", type: "Abstract Design staters", wt: 6.45, conf: "Medium", method: "Metrology", qual: "weight only", note: "Weight cut in steps of ~5% after c. 125 BC" },
    { id: 4, year: -58, label: "58 BC", series: "Gallic War type", type: "Gallo-Belgic E, start", wt: 6.35, conf: "Medium", method: "Metrology", qual: "weight only" },
    { id: 5, year: -54, label: "58-50 BC", series: "Gallic War type", type: "Gallo-Belgic E, alloy", au: 60, ag: 30, cu: 10, conf: "Medium", method: "Electron microprobe", qual: "Au upper bound; Ag lower bound; Cu approx.", note: "Under 60% gold, over 30% silver, copper ~10%" },
    { id: 6, year: -50, label: "c. 50 BC", series: "Gallic War type", type: "Gallo-Belgic E, end", wt: 5.8, conf: "Medium", method: "Metrology", qual: "weight only" },
    { id: 9, year: -55, label: "c. 60-50 BC", series: "Corieltauvi uninscribed", type: "Whitwell Hoard SF 3 (ABC 1722)", wt: 6.11, au: 48.16, ag: 40.19, cu: 10.2, conf: "Medium-Low", method: "XRF (surface)", qual: "single coin", single: true, note: "Single coin; surface XRF can overstate gold. Date is an assignment to check against ABC" },
    { id: 7, year: -25, label: "after 50 BC", series: "British inscribed staters", type: "Southern & eastern dynastic staters", au: 47.5, ag: 15, cu: 35, conf: "Medium", method: "Electron microprobe", qual: "midpoints of ranges Au 45-50, Ag 10-20, Cu 30-40", note: "Copper replaces both gold and silver; coins turn reddish" },
    { id: 8, year: -10, label: "c. 10 BC", series: "British inscribed staters", type: "Stabilized stater weight", wt: 5.4, conf: "Medium", method: "Metrology", qual: "weight only" },
    { id: 10, year: 30, label: "1st c. AD", series: "Late inscribed staters", type: "Dobunni EISV & Corieltauvi VEP CORF (7 coins)", au: 20, ag: 10, cu: 70, conf: "Low-Medium", method: "SEM-EDS", qual: "approx. group average", note: "Date is an assignment, not stated by source. Suggests standardisation between the two tribes" }
  ];
  const celticQual = [
    { tribe: "Durotriges (Dorset)", note: "Gold to silver to billon to bronze; stopped circulating outside the tribe", conf: "Medium" },
    { tribe: "Iceni (Norfolk)", note: "Extremely debased during and after the Gallic War; gold restored c. 45 BC", conf: "Low" }
  ];

  /* ---------- PTOLEMAIC BRONZE ---------- */
  // A Metrological Survey of Ptolemaic Bronze Coins II: Alexandria, 1st & 2nd c. BC (AJN 2021)
  const ptolSeries = [
    { o: 1, key: "S3",  name: "Standard 3, unmarked", date: "Late 3rd to early 2nd c. BC", anchored: false, py: -204, types: 10, n: 379,  gpu: 0.3850 },
    { o: 2, key: "S4",  name: "Standard 4, unmarked", date: "2nd c. BC", anchored: false, py: -190, types: 5, n: 1363, gpu: 0.2216 },
    { o: 3, key: "S4K", name: "Standard 4, Class 1 (K mark)", date: "2nd c. BC", anchored: false, py: -185, types: 6, n: 161, gpu: 0.2198 },
    { o: 4, key: "S5",  name: "Standard 5, unmarked", date: "2nd c. BC", anchored: false, py: -175, types: 3, n: 1738, gpu: 0.1923 },
    { o: 5, key: "S5K", name: "Standard 5, Class 2 (Kleopatra inscription)", date: "c. 168-163 BC", anchored: true, py: -165.5, types: 3, n: 153, gpu: 0.1872 },
    { o: 6, key: "S5C3",name: "Standard 5, Class 3", date: "Around 168-163 BC", anchored: false, py: -164, types: 4, n: 661, gpu: 0.1876 },
    { o: 7, key: "C4",  name: "Class 4, dated (Ptolemy IX & Cleopatra III)", date: "c. 115-112 BC", anchored: true, py: -113.5, types: 4, n: 302, gpu: 0.2093 },
    { o: 8, key: "C5",  name: "Class 5", date: "After Class 4, undated", anchored: false, py: -100, types: 2, n: 52, gpu: 0.2380 },
    { o: 9, key: "C6",  name: "Class 6 (Cleopatra VII)", date: "c. 50-30 BC", anchored: true, py: -40, types: 2, n: 220, gpu: 0.2181 }
  ];
  const ptolCoins = [
    [1,"Sv1423 Horn A","Zeus Ammon, large horn at forehead",100,40.7,21],
    [1,"Sv1423 Horn B","Zeus Ammon, large horn at top of head",100,39,54],
    [1,"Sv1423 Horn C","Zeus Ammon, normal horn",100,38.5,22],
    [1,"Sv1491","Large Isis, style 1",75,30.1,33],
    [1,"Sv1233","Large Isis, style 2",75,28.7,35],
    [1,"Sv1492","Heracles in lion skin, large",50,18.9,38],
    [1,"Sv1493","Alexander in elephant skin, large",40,15.1,80],
    [1,"Sv1154","Isis, closed-wing eagle",20,7.31,66],
    [1,"Sv1496","Heracles, small",10,3.72,2],
    [1,"Sv1155","Helmeted warrior",10,3.91,28],
    [2,"Sv1424B","Zeus Ammon / two eagles, cornucopia",100,22.5,907],
    [2,"Sv1234","Isis, medium 1",80,18,193],
    [2,"Sv1494","Heracles, medium",50,11.4,79],
    [2,"Sv1236","Alexander, medium",40,8.7,100],
    [2,"Sv1238","Isis, closed-wing eagle",20,4.25,84],
    [3,"Sv1375 var.","Zeus Ammon (monogram)",100,20.7,12],
    [3,"Sv1375 K","Zeus Ammon",100,21.6,35],
    [3,"Sv1376","Heracles",50,10.7,78],
    [3,"Sv1377","Zeus Ammon",30,7.13,12],
    [3,"Sv1378","Nilus",20,4.92,13],
    [3,"Sv1379","Helmeted warrior",15,2.97,11],
    [4,"Sv1424B","Zeus Ammon / two eagles, cornucopia",120,22.5,907],
    [4,"Sv1235","Isis, medium 2",80,15.6,70],
    [4,"Sv1426","Zeus Ammon / two eagles, small",40,7.78,761],
    [5,"Sv1380","Zeus Ammon",120,23.4,74],
    [5,"Sv1381","Alexander",40,7.12,52],
    [5,"Sv1382","Isis",20,3.77,27],
    [6,"Sv1383","Zeus Ammon",120,22.6,34],
    [6,"Sv1384","Isis",80,15.4,547],
    [6,"Sv1385","Heracles",50,9.17,62],
    [6,"Sv1386","Alexander",40,7.44,18],
    [7,"Sv1190","Zeus Ammon, year 3",80,16.5,102],
    [7,"Sv1193","Zeus Ammon, year 4",80,16.5,37],
    [7,"Sv1191","Heracles, year 3",40,8.18,154],
    [7,"Sv1194","Athena, year 4",25,5.51,9],
    [8,"Sv1732","Zeus Ammon / eagle, K-Lambda",5,1.13,17],
    [8,"Sv1733","Zeus Ammon / eagle, B-A",5,1.25,35],
    [9,"Sv1871","Cleopatra VII, Pi mark (80)",80,17.2,131],
    [9,"Sv1872","Cleopatra VII, M mark (40)",40,8.85,89]
  ].map(r => ({ o: r[0], ref: r[1], type: r[2], fv: r[3], wt: r[4], n: r[5] }));

  /* ---------- TUDOR ---------- */
  // Challis, A New History of the Royal Mint (1992), App. 2; penny figures from Munro (2010) WP 417
  const tudor = [
    { t: 1526.85, date: "5 Nov 1526", mon: "Henry VIII", ev: "Tower indenture: penny weight reduced, fineness kept", oz: "11 oz 2 dwt", pct: 92.5, pg: 0.639 },
    { t: 1542.37, date: "16 May 1542", mon: "Henry VIII", ev: "Great Debasement begins", oz: "10 oz silver, 2 oz alloy (read as 9 oz 2 dwt)", pct: 75.83, note: "Wording ambiguous: Challis reads 75.83%, Munro 77.08%" },
    { t: 1544.41, date: "28 May 1544", mon: "Henry VIII", ev: "Second step", oz: "9 oz", pct: 75 },
    { t: 1545.5, date: "1545", mon: "Henry VIII", ev: "Third step", oz: "6 oz", pct: 50, note: "Exact indenture date in Challis appendix" },
    { t: 1546.5, date: "1546", mon: "Henry VIII", ev: "Fourth step", oz: "4 oz", pct: 33.33, note: "Exact indenture date in Challis appendix" },
    { t: 1551.29, date: "15 Apr 1551", mon: "Edward VI", ev: "Low point of the debasement", oz: "3 oz", pct: 25, pg: 0.108 },
    { t: 1551.78, date: "Oct 1551", mon: "Edward VI", ev: "Fine silver coinage restored (penny)", oz: "", pct: null, pg: 0.477, note: "Base small change issued alongside at 3 oz (25%)" },
    { t: 1551.95, date: "Dec 1551", mon: "Edward VI", ev: "Further base issue", oz: "2 oz", pct: null, pg: 0.216 },
    { t: 1553.45, date: "Jun 1553", mon: "Edward VI", ev: "Last base issue", oz: "3 oz", pct: 25, pg: 0.259 },
    { t: 1553.62, date: "Aug 1553", mon: "Mary I", ev: "Near-sterling standard restored", oz: "11 oz", pct: 91.67, pg: 0.475 },
    { t: 1560.85, date: "Nov 1560", mon: "Elizabeth I", ev: "Great Recoinage; full sterling restored", oz: "11 oz 2 dwt", pct: 92.5, pg: 0.48, note: "Penny weight 8 grains (0.518 g)" },
    { t: 1601.54, date: "Jul 1601", mon: "Elizabeth I", ev: "Weight reduction; sterling kept", oz: "11 oz 2 dwt", pct: 92.5, pg: 0.464 }
  ];

  /* ---------- US ---------- */
  // BLS CPI-U annual averages; purchasing power expressed in 2025 dollars
  const usRaw = [[1913,9.9,null,32.52],[1914,10,1.01,32.19],[1915,10.1,1,31.88],[1916,10.9,7.92,29.54],[1917,12.8,17.43,25.15],[1918,15.1,17.97,21.32],[1919,17.3,14.57,18.61],[1920,20,15.61,16.1],[1921,17.9,-10.5,17.99],[1922,16.8,-6.15,19.16],[1923,17.1,1.79,18.83],[1924,17.1,0.2,18.83],[1925,17.5,2.54,18.4],[1926,17.7,0.95,18.19],[1927,17.4,-1.69,18.5],[1928,17.2,-1.35,18.72],[1929,17.2,0,18.72],[1930,16.7,-2.91,19.28],[1931,15.2,-8.98,21.18],[1932,13.6,-10.53,23.67],[1933,13,-4.41,24.76],[1934,13.4,3.35,24.03],[1935,13.7,2.49,23.5],[1936,13.9,0.97,23.16],[1937,14.4,3.61,22.36],[1938,14.1,-1.86,22.83],[1939,13.9,-1.42,23.16],[1940,14,0.96,22.99],[1941,14.7,5,21.9],[1942,16.3,10.66,19.75],[1943,17.3,6.15,18.61],[1944,17.6,1.74,18.29],[1945,18,2.28,17.89],[1946,19.5,8.33,16.51],[1947,22.3,14.36,14.44],[1948,24.1,8.07,13.36],[1949,23.8,-0.97,13.53],[1950,24.1,1.26,13.36],[1951,26,7.88,12.38],[1952,26.5,1.92,12.15],[1953,26.8,1.13,12.01],[1954,26.9,0.37,11.97],[1955,26.8,-0.37,12.01],[1956,27.2,1.49,11.83],[1957,28.1,3.31,11.46],[1958,28.9,2.85,11.14],[1959,29.2,1.04,11.03],[1960,29.6,1.37,10.88],[1961,29.9,1.01,10.77],[1962,30.3,1.34,10.63],[1963,30.6,0.99,10.52],[1964,31,1.31,10.39],[1965,31.5,1.61,10.22],[1966,32.5,3.17,9.9],[1967,33.4,2.77,9.64],[1968,34.8,4.19,9.25],[1969,36.7,5.46,8.77],[1970,38.8,5.72,8.3],[1971,40.5,4.38,7.95],[1972,41.8,3.21,7.7],[1973,44.4,6.22,7.25],[1974,49.3,11.04,6.53],[1975,53.8,9.13,5.98],[1976,56.9,5.76,5.66],[1977,60.6,6.5,5.31],[1978,65.2,7.59,4.94],[1979,72.6,11.35,4.43],[1980,82.4,13.5,3.91],[1981,90.9,10.32,3.54],[1982,96.5,6.16,3.34],[1983,99.6,3.21,3.23],[1984,103.9,4.32,3.1],[1985,107.6,3.56,2.99],[1986,109.6,1.86,2.94],[1987,113.6,3.65,2.83],[1988,118.3,4.14,2.72],[1989,124,4.82,2.6],[1990,130.7,5.4,2.46],[1991,136.2,4.21,2.36],[1992,140.3,3.01,2.3],[1993,144.5,2.99,2.23],[1994,148.2,2.56,2.17],[1995,152.4,2.83,2.11],[1996,156.9,2.95,2.05],[1997,160.5,2.29,2.01],[1998,163,1.56,1.97],[1999,166.6,2.21,1.93],[2000,172.2,3.36,1.87],[2001,177.1,2.85,1.82],[2002,179.9,1.58,1.79],[2003,184,2.28,1.75],[2004,188.9,2.66,1.7],[2005,195.3,3.39,1.65],[2006,201.6,3.23,1.6],[2007,207.3,2.83,1.55],[2008,215.3,3.84,1.5],[2009,214.5,-0.36,1.5],[2010,218.1,1.64,1.48],[2011,224.9,3.11,1.43],[2012,229.6,2.09,1.4],[2013,233,1.48,1.38],[2014,236.7,1.59,1.36],[2015,237,0.13,1.36],[2016,240,1.26,1.34],[2017,245.1,2.13,1.31],[2018,251.1,2.44,1.28],[2019,255.7,1.81,1.26],[2020,258.8,1.23,1.24],[2021,271,4.7,1.19],[2022,292.7,8,1.1],[2023,304.7,4.12,1.06],[2024,313.689,2.95,1.03],[2025,321.943,2.63,1]];
  const us = usRaw.map(r => ({ year: r[0], cpi: r[1], infl: r[2], pp: r[3], idx: (r[3] / 32.52) * 100 }));

  /* ---------- Measures: each returns [{x (calendar), y, label, approx}] ---------- */
  const MEASURES = {
    rome: {
      fine:   { label: "Fineness, % silver (Walker)", unit: "%", pts: () => romeWalker.map(d => ({ x: d.mid, y: d.pct, lo: d.lo, hi: d.hi, approx: d.approx, label: d.ruler, note: d.note, src: "Walker 1976-78 (XRF surface)" })) },
      silver: { label: "Silver per denarius, g (Walker)", unit: "g", pts: () => romeWalker.filter(d => d.ag).map(d => ({ x: d.mid, y: d.ag, label: d.ruler, note: d.note, src: "Walker 1976-78 (XRF surface)" })) },
      bp:     { label: "Fineness, % silver (Butcher & Ponting)", unit: "%", pts: () => romeBP.map(d => ({ x: d.mid, y: d.pct, lo: d.lo, hi: d.hi, label: d.ruler, note: d.note, src: "Butcher & Ponting 2005, " + d.method })) }
    },
    celtic: {
      gold:   { label: "Gold content, % (stater alloy)", unit: "%", pts: () => celtic.filter(d => d.au != null && !d.single).map(d => ({ x: d.year, y: d.au, label: d.series + " · " + d.label, note: d.qual, src: "Van Arsdell, " + d.method })) },
      weight: { label: "Stater weight, g", unit: "g", pts: () => celtic.filter(d => d.wt != null && !d.single).map(d => ({ x: d.year, y: d.wt, label: d.series + " · " + d.label, note: d.qual, src: "Van Arsdell, " + d.method })) }
    },
    ptol: {
      gpu:    { label: "Bronze per unit of face value, g", unit: "g/unit", pts: () => ptolSeries.map(d => ({ x: d.py, y: d.gpu, label: d.name, note: d.date + (d.anchored ? " (anchored)" : " (placed by series order; date approximate)"), approx: !d.anchored, src: "AJN 2021 metrological survey, " + d.n + " specimens" })) }
    },
    tudor: {
      penny:  { label: "Fine silver in the penny, g", unit: "g", pts: () => tudor.filter(d => d.pg != null).map(d => ({ x: d.t, y: d.pg, label: d.mon + " · " + d.date, note: d.ev, src: "Munro 2010 from Challis indentures" })) },
      fine:   { label: "Fineness, % silver (indentures)", unit: "%", pts: () => tudor.filter(d => d.pct != null).map(d => ({ x: d.t, y: d.pct, label: d.mon + " · " + d.date, note: d.ev + (d.note ? ". " + d.note : ""), src: "Challis 1992, App. 2" })) }
    },
    us: {
      pp:     { label: "What a 1913 dollar still buys, %", unit: "%", pts: () => us.map(d => ({ x: d.year, y: d.idx, label: String(d.year), note: "CPI-U " + d.cpi + (d.infl != null ? "; inflation " + d.infl.toFixed(1) + "%" : ""), src: "BLS CPI-U" })) },
      cpi:    { label: "CPI-U (1982-84 = 100)", unit: "", pts: () => us.map(d => ({ x: d.year, y: d.cpi, label: String(d.year), note: d.infl != null ? "Inflation " + d.infl.toFixed(1) + "%" : "", src: "BLS CPI-U" })) }
    }
  };
  // Measures where a higher number means the holder lost value (so the index must invert).
  const INVERTED = { "us.cpi": true };

  function indexed(key, mkey) {
    const pts = MEASURES[key][mkey].pts().slice().sort((a, b) => a.x - b.x);
    const base = pts[0].y, x0 = pts[0].x, inv = INVERTED[key + "." + mkey];
    return pts.map(p => Object.assign({}, p, {
      raw: p.y, el: p.x - x0,
      y: inv ? (base / p.y) * 100 : (p.y / base) * 100
    }));
  }

  function fmtYear(y) {
    const r = Math.round(y);
    if (r < 0) return (-r) + " BC";
    if (r < 500) return "AD " + r;
    return String(r);
  }

  /* ---------- Coin renderer (SVG) ---------- */
  let coinUid = 0;
  const silverScale = t => {
    const s = d3.scaleLinear().domain([0, 0.06, 0.35, 0.7, 1]).range([PAL.verdigris, PAL.bronze, PAL.billon, PAL.worn, PAL.fine]).clamp(true);
    return s(t);
  };
  const goldScale = t => d3.scaleLinear().domain([0, 0.35, 0.8]).range([PAL.copper, "#C08A3E", PAL.gold]).clamp(true)(t);
  const bronzeScale = t => d3.scaleLinear().domain([0, 1]).range([PAL.verdigris, PAL.bronze]).clamp(true)(t);
  const zincScale = t => d3.scaleLinear().domain([0, 1]).range([PAL.zinc, PAL.copper]).clamp(true)(t);

  function makeCoin(parent, opts) {
    const o = Object.assign({ r: 60, value: 1, metal: "silver", legend: "", seed: 7, rim: 0.86 }, opts);
    const id = "coin" + (++coinUid);
    const g = parent.append("g").attr("class", "coin");
    const defs = g.append("defs");
    const grad = defs.append("radialGradient").attr("id", id + "g").attr("cx", "36%").attr("cy", "32%").attr("r", "75%");
    const s0 = grad.append("stop").attr("offset", "0%");
    const s1 = grad.append("stop").attr("offset", "60%");
    const s2 = grad.append("stop").attr("offset", "100%");
    defs.append("clipPath").attr("id", id + "c").append("circle").attr("r", o.r);
    defs.append("path").attr("id", id + "p").attr("d", arcPath(o.r * 0.72));

    const body = g.append("circle").attr("r", o.r).attr("fill", `url(#${id}g)`);
    const patches = g.append("g").attr("clip-path", `url(#${id}c)`);
    const rnd = d3.randomLcg(o.seed / 100);
    const blot = d3.range(14).map(i => {
      const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * o.r * 0.95;
      return { x: Math.cos(a) * d, y: Math.sin(a) * d, rx: o.r * (0.1 + rnd() * 0.22), ry: o.r * (0.07 + rnd() * 0.16), rot: rnd() * 180, k: rnd(), c: rnd() > 0.45 ? PAL.verdigris : PAL.bronze };
    });
    const blots = patches.selectAll("ellipse").data(blot).join("ellipse")
      .attr("cx", d => d.x).attr("cy", d => d.y).attr("rx", d => d.rx).attr("ry", d => d.ry)
      .attr("transform", d => `rotate(${d.rot} ${d.x} ${d.y})`).attr("fill", d => d.c).attr("opacity", 0);
    // beaded border
    const beads = g.append("g");
    d3.range(56).forEach(i => {
      const a = (i / 56) * Math.PI * 2;
      beads.append("circle").attr("cx", Math.cos(a) * o.r * 0.9).attr("cy", Math.sin(a) * o.r * 0.9).attr("r", o.r * 0.022);
    });
    g.append("circle").attr("r", o.r - 0.75).attr("fill", "none").attr("stroke-width", 1.5).attr("class", "coin-rim");
    const inner = g.append("circle").attr("r", o.r * 0.5).attr("fill", "none").attr("stroke-width", 1.2);
    const legend = g.append("text").attr("class", "coin-legend").attr("font-size", Math.max(7, o.r * 0.15))
      .append("textPath").attr("href", `#${id}p`).attr("startOffset", "50%").attr("text-anchor", "middle").text(o.legend);
    const mark = g.append("text").attr("class", "coin-mark").attr("text-anchor", "middle").attr("dy", "0.35em").attr("font-size", o.r * 0.34);

    function paint(v, dur) {
      const sc = o.metal === "gold" ? goldScale : o.metal === "bronze" ? bronzeScale : o.metal === "zinc" ? zincScale : silverScale;
      const base = sc(v);
      const c = d3.color(base);
      const tr = sel => (dur ? sel.transition().duration(dur) : sel);
      tr(s0).attr("stop-color", d3.color(base).brighter(0.9));
      tr(s1).attr("stop-color", base);
      tr(s2).attr("stop-color", d3.color(base).darker(0.9));
      const dark = c.darker(1.4).formatHex();
      tr(beads.selectAll("circle")).attr("fill", dark);
      tr(g.selectAll(".coin-rim")).attr("stroke", dark);
      tr(inner).attr("stroke", dark);
      tr(g.select(".coin-legend")).attr("fill", dark);
      tr(mark).attr("fill", dark);
      const decay = o.metal === "zinc" ? 0 : 1 - v;
      tr(blots).attr("opacity", d => (d.k < decay * 1.05 ? 0.35 + 0.45 * decay : 0));
    }
    paint(o.value, 0);
    return {
      g,
      set(v, dur = 900) { o.value = v; paint(v, dur); return this; },
      legend(t) { legend.text(t); return this; },
      mark(t) { mark.text(t); return this; },
      metal(m, dur) { o.metal = m; paint(o.value, dur); return this; }
    };
  }
  function arcPath(r) { return `M ${-r},0 A ${r},${r} 0 1,1 ${r},0 A ${r},${r} 0 1,1 ${-r},0`; }

  /* ---------- Guilloche (canvas) ---------- */
  function guilloche(canvas, opts) {
    const o = Object.assign({ color: "rgba(63,122,107,0.35)", color2: "rgba(140,47,43,0.28)", rings: 2 }, opts);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); ctx.lineWidth = 0.6;
    // wave bands
    for (let b = 0; b < 2; b++) {
      const yc = b === 0 ? h * 0.12 : h * 0.9;
      for (let k = 0; k < 9; k++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = yc + Math.sin(x / 38 + k * 0.7) * 10 + Math.sin(x / 91 - k * 0.35) * 6;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = b ? o.color2 : o.color; ctx.stroke();
      }
    }
    // spirograph rosettes
    const ros = [[w * 0.82, h * 0.5, Math.min(h, w) * 0.34, o.color], [w * 0.1, h * 0.55, Math.min(h, w) * 0.18, o.color2]];
    ros.forEach(([cx, cy, R, col]) => {
      ctx.strokeStyle = col;
      for (let i = 0; i < 48; i++) {
        const a0 = (i / 48) * Math.PI * 2;
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2 + 0.01; t += 0.05) {
          const rr = R * (0.68 + 0.32 * Math.cos(5 * t));
          const x = cx + Math.cos(t + a0) * rr, y = cy + Math.sin(t + a0) * rr * 0.98;
          t ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    });
  }


  /* ---------- Melting coin: a disc whose lower part is the precious metal, upper part base metal ---------- */
  let meltUid = 0;
  function makeMelt(parent, opts) {
    const o = Object.assign({ r: 34, frac: 1, good: PAL.fine, base: PAL.bronze, est: false, rim: "#5a4030" }, opts);
    const id = "melt" + (++meltUid);
    const g = parent.append("g").attr("class", "melt");
    g.append("defs").append("clipPath").attr("id", id).append("circle").attr("r", o.r);
    const inner = g.append("g").attr("clip-path", `url(#${id})`);
    const baseC = inner.append("rect").attr("x", -o.r).attr("y", -o.r).attr("width", 2 * o.r).attr("height", 2 * o.r).attr("fill", o.base);
    const good = inner.append("rect").attr("x", -o.r).attr("width", 2 * o.r).attr("fill", o.good);
    const surf = inner.append("line").attr("x1", -o.r).attr("x2", o.r).attr("stroke", "rgba(255,255,255,.55)").attr("stroke-width", 1.2);
    inner.append("circle").attr("r", o.r * 0.62).attr("fill", "none").attr("stroke", "rgba(0,0,0,.18)").attr("stroke-width", 1);
    g.append("circle").attr("r", o.r).attr("fill", "none").attr("stroke", o.rim).attr("stroke-width", Math.max(2, o.r * 0.12));
    const est = g.append("circle").attr("r", o.r + Math.max(3, o.r * 0.1)).attr("fill", "none").attr("stroke", "#EFE4CC").attr("stroke-width", 1).attr("stroke-dasharray", "2 3").attr("opacity", o.est ? 0.8 : 0);
    function place(f, dur, delay) {
      const yTop = o.r - 2 * o.r * Math.max(0, Math.min(1, f));
      const t = sel => (dur ? sel.transition().delay(delay || 0).duration(dur).ease(d3.easeCubicInOut) : sel);
      t(good).attr("y", yTop).attr("height", o.r - yTop);
      t(surf).attr("y1", yTop).attr("y2", yTop).attr("opacity", f > 0.01 && f < 0.99 ? 1 : 0);
    }
    place(o.frac, 0);
    return {
      g,
      set(f, dur = 900, delay = 0) { o.frac = f; place(f, dur, delay); return this; },
      colors(goodC, baseC_) { good.attr("fill", goodC); baseC.attr("fill", baseC_); return this; },
      est(on) { est.attr("opacity", on ? 0.8 : 0); return this; }
    };
  }

  /* ---------- Waffle: 10 x 10 cells filled bottom-up by parts [{v, color}] ---------- */
  function makeWaffle(parent, opts) {
    const o = Object.assign({ size: 200, gap: 2, empty: "rgba(239,228,204,.08)", round: 0 }, opts);
    const cs = (o.size - o.gap * 9) / 10;
    const g = parent.append("g").attr("class", "waffle");
    const cells = g.selectAll("rect").data(d3.range(100)).join("rect")
      .attr("x", i => (i % 10) * (cs + o.gap)).attr("y", i => (9 - Math.floor(i / 10)) * (cs + o.gap))
      .attr("width", cs).attr("height", cs).attr("rx", o.round).attr("fill", o.empty);
    function colorAt(parts, i) {
      let acc = 0;
      for (const p of parts) { acc += p.v; if (i < Math.round(acc)) return p.color; }
      return o.empty;
    }
    return {
      g,
      set(parts, dur = 0, stagger = 6) {
        const sel = dur ? cells.transition().delay(i => i * stagger).duration(dur) : cells;
        sel.attr("fill", i => colorAt(parts, i));
        return this;
      },
      cells
    };
  }

  global.PENNY = { PAL, SERIES, romeWalker, romeBP, celtic, celticQual, ptolSeries, ptolCoins, tudor, us, MEASURES, indexed, fmtYear, makeCoin, guilloche, silverScale, makeMelt, makeWaffle };
})(window);
