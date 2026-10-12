// Audited classification for the V2 presentation-only Legacy split.
// Do not change IDs, question IDs, prerequisite rules, or saved study records.
export const PILOT_LEGACY_IDS=Object.freeze(['L01','L02','L03','L04','L05']);
export const UNREFERENCED_LEGACY_IDS=Object.freeze([
 'CETA-G03-01',
 'MATH-001','MATH-002','MATH-003',
 'MATH-004','MATH-005','MATH-006'
]);
const PILOT=new Set(PILOT_LEGACY_IDS);
const UNREFERENCED=new Set(UNREFERENCED_LEGACY_IDS);

export function legacyGroup(lessonOrId){
 const id=typeof lessonOrId==='string'?lessonOrId:lessonOrId?.id;
 return PILOT.has(id)?'pilot':UNREFERENCED.has(id)?'unreferenced':null;
}
export const isArchivedLesson=lessonOrId=>legacyGroup(lessonOrId)!==null;
export function legacyReason(lessonOrId){
 const id=typeof lessonOrId==='string'?lessonOrId:lessonOrId?.id;
 if(PILOT.has(id))return 'Original five-lesson CETa pilot · independent foundational instruction';
 if(id==='CETA-G03-01')return 'Created from the Chapter 3 table-of-contents topic, not the chapter pages';
 if(UNREFERENCED.has(id))return 'Original mathematics companion · not derived from a scanned textbook chapter';
 return '';
}
