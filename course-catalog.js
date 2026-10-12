// Electrical Understanding v2 — source-aware curriculum CATALOG.
// Metadata only: pending chapters have NOT been read or converted to working lessons.
// Existing pilot IDs L01-L05 remain in lessons.js and are not copied or renumbered here.
export const cetaGuideUnits = [
  {id:'G01',title:'Introduction', chapters:[['1','CET Program Description',1],['2','Safety Precautions',7]]},
  {id:'G02',title:'DC Electronics',chapters:[['3','Basic Math used in Electronic Service & Decibels',16],['4','DC Circuits',25]]},
  {id:'G03',title:'AC Electronics',chapters:[['5','Capacitance, Inductance, Transformers and Filter Circuits',36],['6','AC Circuit Operations',45],['7','Generators, Alternators and Motors',53]]},
  {id:'G04',title:'Components and Semiconductors',chapters:[['8','Electronic Components',62],['9','Semiconductors',70],['10','Discrete Solid State Circuits',79]]},
  {id:'G05',title:'Analog Circuits',chapters:[['11','Electronic Power Supplies',85],['12','Amplifier Circuits, Types and dBs',91]]},
  {id:'G06',title:'RF Cabling and Telecommunications',chapters:[['13','Basic Radio, RF Signal Propagation, Common Frequencies',104],['14','Transmitters',113],['15','Basics of Telephone',120]]},
  {id:'G07',title:'Digital Circuits and Microprocessors',chapters:[['16','Digital Concepts, Gates, Logic Circuits and Computer Basics',132],['17','Microprocessors',149]]},
  {id:'G08',title:'Troubleshooting, Test Equipment and Repair',chapters:[['18','Basic Diagnostic Techniques',159],['19','Test Equipment',165],['20','Soldering, Desoldering, PCB Repair and Handtools',176]]},
  {id:'G09',title:'Shop and Service Management',chapters:[['21','Record Keeping, Productivity Calculation, Personal Behavior',182],['22','Technical Writing',188]]}
];
export const eimBasicExperiments = [
  ['PreLab','Component Basics',1,'source-reviewed'],
  ['DC 01',"Ohm's Law",13,'indexed'],['DC 02','Series & Parallel Circuits',21,'source-reviewed'],
  ['DC 03','Voltage & Current Divider',29,'indexed'],['DC 04',"Watt's Law",35,'indexed'],
  ['DC 05',"Kirchhoff's Laws",43,'indexed'],['DC 06','Superposition',51,'indexed'],
  ['DC 07','Thevenin Theorem',57,'indexed'],['DC 08','Maximum Power Transfer',63,'indexed'],
  ['DC 09',"Norton's Theorem",69,'indexed'],['DC 10','Mesh Analysis',75,'indexed'],
  ['DC 11','Nodal Analysis',83,'indexed'],['DC 12','Capacitor Basics',91,'indexed'],
  ['DC 13','RC Circuits',101,'indexed'],['DC 14','Inductors',109,'indexed'],
  ['AC 15','Introduction of AC',117,'indexed'],['AC 16','Oscilloscope and Function Generators',129,'indexed'],
  ['AC 17','Resistors and Diodes in AC',143,'indexed'],['AC 18','Capacitors in AC',155,'indexed'],
  ['AC 19','Warp-up Project',165,'indexed']
];
export const catalog = [
  {id:'ceta',title:'Exam Preparation',tagline:'Build toward certification exams, starting with Associate CET. More exam paths can be added here later.',subtracks:[
    {id:'core',title:'Core CETa Course',status:'planned',summary:'Rebuilding the new CETa core; earlier L01–L05 lessons are preserved separately in Legacy Lessons.',units:[{id:'pilot',title:'Pilot Unit 1 — Electrical Foundations',summary:'L01–L05; current working lessons and interactive experiments.'}]},
    {id:'guide',title:'Associate CET Study Guide',status:'indexed',summary:'9 units · 22 chapters indexed. The original Chapter 3 topic-only exercise is preserved in Legacy Group 2 while new source-backed lessons await scanned chapter pages.',units:cetaGuideUnits},
    {id:'exam',title:'Competency & Exam Practice',status:'planned',summary:'Mixed-topic assessments, diagnosis-based review and spaced retrieval.',units:[]}
  ]},
  {id:'textbooks',title:'Textbook Companions',tagline:'One private study path for each book.',subtracks:[
    {id:'geier',title:'How to Diagnose and Fix Everything Electronic',status:'active',summary:'Third edition, Chapter 6 DMM, pp. 97–103. First two interactive lessons are published; five additional companion designs are staged.',units:[{id:'geier-dmm',title:'Chapter 6 — Digital Multimeter',summary:'BDMM-01 and BDMM-02 live; BDMM-03 through BDMM-07 are planned, not yet released.'}]},
    {id:'teach',title:'Teach Yourself Electricity and Electronics',status:'awaiting-book',summary:'Seventh edition; awaiting the book and contextual chapter scans.',units:[]},
    {id:'principles',title:'Electronics: Principles and Applications',status:'awaiting-book',summary:'Awaiting your copy and edition confirmation.',units:[]},
    {id:'cabling',title:'Cabling: The Complete Guide to Copper and Fiber-Optic Networking',status:'awaiting-book',summary:'Awaiting your copy and edition confirmation.',units:[]}
  ]},
  {id:'labs',title:'Hands-On Laboratory',tagline:'Build, measure, explain and troubleshoot.',subtracks:[
    {id:'basic',title:'EIM — Basic Electric Circuits',status:'active',summary:'Current kit priority. PreLab and DC 02 scanned; curated activities are in development.',units:eimBasicExperiments.map(([id,title,page,source])=>({id,title,page,source}))},
    {id:'analog',title:'EIM — Fundamental Analog Circuits and Semiconductors',status:'paused',summary:'Paused after Chapter 2, Section 2.1 (pp. 81–93); no new scans or projects until you resume.',units:[{id:'an-2.1',title:'Chapter 2 §2.1 — Equipment and Tools',summary:'Source reviewed; interactive companion drafted, not live.'}]},
    {id:'fpga',title:'EIM — Fundamental Digital Design with FPGA',status:'waiting',summary:'Waiting until one of the two allocated manuals is finished or changed.',units:[]},
    {id:'rp2040',title:'EIM — Introduction to Microcontroller with RP2040',status:'waiting',summary:'Waiting; kit parts remain separate from active manuals.',units:[]}
  ]},
  {id:'math',title:'Mathematics Companion',tagline:'New source-backed math lessons will connect to their textbook chapters; original math practice is preserved in Legacy Group 2.',subtracks:[]}
];
export const catalogTrack = id => catalog.find(t=>t.id===id);
export const catalogSubtrack = id => catalog.flatMap(t=>t.subtracks.map(s=>({...s,trackId:t.id,trackTitle:t.title}))).find(s=>s.id===id);
