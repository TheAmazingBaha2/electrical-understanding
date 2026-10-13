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
 {id:'ceta',title:'Exam Prep',subtracks:[{id:'guide',title:'Associate CET',status:'indexed',summary:'Chapter-by-chapter certification practice.',units:cetaGuideUnits}]},
 {id:'textbooks',title:'Textbook Companions',subtracks:[{id:'geier',title:'How to Diagnose and Fix Everything Electronic',status:'active',summary:'Troubleshooting book; full contents pending.',units:[{id:'6',title:'Digital Multimeter',page:97}]}]},
 {id:'labs',title:'Labs',subtracks:[
  {id:'basic',title:'EIM · Basic Electric Circuits',status:'active',units:eimBasicExperiments.map(([id,title,page,source])=>({id,title,page,source}))},
  {id:'analog',title:'EIM · Fundamental Analog Circuits and Semiconductors',status:'paused',units:[{id:'2.1',title:'Equipment and Tools',page:81}]},
  {id:'fpga',title:'EIM · Fundamental Digital Design with FPGA',status:'waiting',units:[]},
  {id:'rp2040',title:'EIM · Introduction to Microcontroller with RP2040',status:'waiting',units:[]}
 ]},
 {id:'math',title:'Math Practice',subtracks:[]}
];
export const catalogTrack=id=>catalog.find(t=>t.id===id);
export const catalogSubtrack=id=>catalog.flatMap(t=>t.subtracks.map(s=>({...s,trackId:t.id,trackTitle:t.title}))).find(s=>s.id===id);
