// Original benchmark fixtures. No copyrighted textbook text or private learning records.
export const CASES = [
 {id:"units-milli",topic:"CETa · engineering units",title:"Convert milliamperes",prompt:"A virtual meter reports 2.5 mA. Convert it to amperes and explain why the prefix matters.",check:["0.0025","1000"]},
 {id:"units-micro",topic:"CETa · engineering units",title:"Convert microfarads",prompt:"Convert 330 µF to farads, showing the power-of-ten factor.",check:["0.00033"]},
 {id:"ohm-basic",topic:"CETa · DC circuits",title:"DC current calculation",prompt:"For an ideal 5 V source and a 1 kΩ load, give the current in A and mA, and the resistor power in mW.",check:["0.005","5 mA","25"]},
 {id:"parallel",topic:"CETa · DC circuits",title:"Three parallel branches",prompt:"Three 1 kΩ resistors are connected in parallel across an ideal 5 V supply. Find each branch current, total current and equivalent resistance.",check:["5 mA","15 mA","333"]},
 {id:"series",topic:"CETa · DC circuits",title:"Resistors in series",prompt:"Three 1 kΩ resistors are in series across a 5 V source. Calculate total resistance and total current.",check:["3000","1.67"]},
 {id:"power",topic:"CETa · power",title:"Energy and watts",prompt:"A low-voltage device uses 24 W for 5 minutes. Calculate energy in joules and state which electrical quantity is measured in watts.",check:["7200","power"]},
 {id:"voltage-polarity",topic:"DMM · probe readings",title:"Reverse voltmeter leads",prompt:"On a safe simulated low-voltage board red is at +5 V and black is at 0 V. What happens if you swap the probes without changing the circuit?",check:["-5"]},
 {id:"dmm-resolution",topic:"DMM · instrument limits",title:"Resolution versus accuracy",prompt:"Meter A displays 5.002 V and meter B displays 5.00 V. Does A necessarily have better accuracy? Explain without assuming their specifications.",check:["accuracy","resolution"]},
 {id:"dropout",topic:"DMM · troubleshooting",title:"Short dropout observation",prompt:"A 5 V rail intermittently drops to 0 V for one millisecond. Why might a normal slow DMM miss this, and what instrument could show it?",check:["oscilloscope"]},
 {id:"meter-safety",topic:"Safety · DMM usage",title:"Meter current-mode safety",prompt:"A beginner suggests touching an ammeter across a battery to measure its current. Explain why that setup is dangerous and describe the correct general principle.",check:["series","short"]},
 {id:"ohms-safety",topic:"Safety · measurement",title:"Ohmmeter on energized circuit",prompt:"Someone wants to use resistance mode on a powered circuit. What should they do first and why?",check:["power","off"]},
 {id:"audio-rc",topic:"Audio electronics",title:"RC low-pass interpretation",prompt:"A resistor is in series with an input and a capacitor goes from the output node to circuit common. The output is taken across the capacitor. Qualitatively, what happens to higher audio frequencies?",check:["attenuat"]}
] as const;
export type Case = typeof CASES[number];
export const MODELS = ["gpt-6-luna","gpt-6.1-sol"] as const;
