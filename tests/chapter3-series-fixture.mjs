import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
// Synthetic metadata only: no private upload, account or original textbook bytes.
export function authoredSeries({includeSummary=false}={}){
 const dir=mkdtempSync(join(tmpdir(),'eu-series-'));
 const source={id:'75f4c1db-1d8c-40df-890b-4211862bcfc4',source_book:'Test Chapter 3',source_pages:'16–24',source_track:'guide',analysis:{facts:Array.from({length:18},(_,i)=>({id:'S'+(i+1),claim:'Synthetic reference identity',confidence:'high',location:'fixture'})),equations:[],gaps:[]}};
 try{
  writeFileSync(join(dir,'source.json'),JSON.stringify(source));
  // Restricted executors may reject synchronous child-process waiting. The
  // optional fixture must be produced by the same Python authoring script.
  if(!process.env.EU_SYNTHETIC_SERIES)execFileSync('python3',[new URL('../scripts/content/author-chapter3.py',import.meta.url).pathname,join(dir,'source.json'),join(dir,'series.json')]);
  const series=JSON.parse(readFileSync(process.env.EU_SYNTHETIC_SERIES||join(dir,'series.json'),'utf8'));
  if(!includeSummary)series.lessons=series.lessons.filter(l=>!l.chapter_summary);
  return {source,series};
 }finally{rmSync(dir,{recursive:true,force:true});}
}
