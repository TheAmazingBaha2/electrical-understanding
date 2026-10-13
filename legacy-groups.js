// Audited classification for the V2 presentation-only Legacy split.
// Do not change IDs, question IDs, prerequisite rules, or saved study records.
export const PILOT_LEGACY_IDS=Object.freeze(['L01','L02','L03','L04','L05']);
export const UNREFERENCED_LEGACY_IDS=Object.freeze([
 'CETA-G03-01',
 'MATH-001','MATH-002','MATH-003',
 'MATH-004','MATH-005','MATH-006'
]);
// Explicitly archive the approved CETa Study Guide Chapter 3 math scan and
// its original source/reinforcement batch. Explicit curated additions and new scans stay active.
export const ARCHIVED_SCAN_CHAPTER_IDS=Object.freeze(['75f4c1db-1d8c-40df-890b-4211862bcfc4']);
const ARCHIVED_SCANS=new Set(ARCHIVED_SCAN_CHAPTER_IDS);
export function isArchivedScanChapter(jobOrId){
 const id=typeof jobOrId==='string'?jobOrId:jobOrId?.id;
 return ARCHIVED_SCANS.has(String(id||'').toLowerCase());
}
const PILOT=new Set(PILOT_LEGACY_IDS);
const UNREFERENCED=new Set(UNREFERENCED_LEGACY_IDS);

export function legacyGroup(lessonOrId){
 const id=typeof lessonOrId==='string'?lessonOrId:lessonOrId?.id;
 return PILOT.has(id)?'pilot':UNREFERENCED.has(id)?'unreferenced':lessonOrId?.generated&&!lessonOrId.curatedSeries&&isArchivedScanChapter(lessonOrId.scanId)?'scan-chapter':null;
}
export const isArchivedLesson=lessonOrId=>legacyGroup(lessonOrId)!==null;
export function legacyReason(lessonOrId){
 const id=typeof lessonOrId==='string'?lessonOrId:lessonOrId?.id;
 if(lessonOrId?.generated&&!lessonOrId.curatedSeries&&isArchivedScanChapter(lessonOrId.scanId))return 'Archived source-backed Chapter 3 batch; source evidence and interactive study retained';
 if(PILOT.has(id))return 'Original five-lesson CETa pilot · independent foundational instruction';
 if(id==='CETA-G03-01')return 'Created from the Chapter 3 table-of-contents topic, not the chapter pages';
 if(UNREFERENCED.has(id))return 'Original mathematics companion · not derived from a scanned textbook chapter';
 return '';
}
