// Chapter headings/page starts transcribed from the learner's six supplied TOC pages, ix–xiv.
// A TOC establishes structure, never coverage of an unseen chapter body.
export const geierChapters = [
 ['1','Prepare for Blastoff: Fixing Is Fun!',1],
 ['2','Setting Up Shop: Tools of the Trade',5],
 ['3','Danger, Danger! Staying Safe',49],
 ['4','I Fix, Therefore I Am: The Philosophy of Troubleshooting',59],
 ['5','Naming Names: Important Terms, Concepts and Building Blocks',85],
 ['6','Working Your Weapons: Using Test Equipment',97],
 ['7','What Little Gizmos Are Made of: Components',153],
 ['8','Road Maps and Street Signs: Diagrams',211],
 ['9','Entering Without Breaking: Getting Inside',241],
 ['10','What the Heck Is That? Recognizing Major Features',257],
 ['11','A-Hunting We Will Go: Signal Tracing and Diagnosis',271],
 ['12','Presto Change-O: Circuit Boards and Replacing Components',287],
 ['13',"That’s a Wrap: Reassembly",317],
 ['14','Pesky Parts and Persnickety Problems',333],
 ['15','Aces Up Your Sleeve: Tips and Tricks for Specific Circuits and Products',351]
].map(([id,title,page])=>({id,title,page,...(id==='2'?{coverage:'Chapter covered · workshop series and final summary'}:id==='6'?{coverage:'Partial chapter · Digital Multimeter, pp. 97–103. Later sections await uploads.'}:{})}));
export const geierBookTitle='How to Diagnose and Fix Everything Electronic';
