// Additive checks inside the existing per-lesson progress document. No new storage key or cloud schema.
export const requiredWorkshopActivities=l=>l.workshop?(l.activities||[]).filter(a=>a.required!==false):[];
export function workshopActivityProgress(l,state={}){
 const activities=requiredWorkshopActivities(l),checks=state.workshopChecks||{};
 return {total:activities.length,correct:activities.filter(a=>checks[a.id]?.correct===true).length,incorrect:activities.filter(a=>checks[a.id]?.correct===false).length};
}
export function lessonRequirementsMet(l,state={}){
 const answers=state.answers||{},quiz=l.questions||[];
 const quizMet=quiz.every(q=>typeof answers[q.id]?.correct==='boolean')&&quiz.filter(q=>answers[q.id]?.correct===true).length>=Math.ceil(.8*quiz.length)&&quiz.filter(q=>q.safety).every(q=>answers[q.id]?.correct===true);
 const practice=workshopActivityProgress(l,state);
 return quizMet&&practice.correct===practice.total;
}
export function workshopCheckUpdate(previous={},value,correct,time=Date.now()){
 return {value,correct:Boolean(correct),attempts:(previous.attempts||0)+1,checkedAt:time};
}
