export const uid=i=>'00000000-0000-4000-8000-'+i.toString(16).padStart(12,'0');
export const ref=(i,version='1.0.0')=>({id:uid(i),version});
export const entity=(kind,i,fields)=>({schemaVersion:3,kind,id:uid(i),...fields});
export function modularFixture(){return {schemaVersion:3,id:uid(99),version:'1.0.0',entities:[
 entity('SourceWork',1,{title:'Synthetic Electronics',authors:[],publisher:null}),
 entity('SourceEdition',2,{workId:uid(1),edition:'Test edition',isbn:null,fingerprint:null,status:'preserved-artifact'}),
 entity('SourceLocator',3,{editionId:uid(2),chapter:'Resistors',section:'Tolerance',printedPages:{start:12,end:13},digitalPages:null,pageLabel:null,citation:'Synthetic Electronics, pp. 12–13',verification:'preserved-reference'}),
 entity('EvidenceClaim',4,{version:'1.0.0',claimType:'definition',text:'Tolerance bounds variation around nominal resistance.',state:'active',locatorIds:[uid(3)],conflictsWith:[]}),
 entity('Topic',5,{title:'Resistor tolerance',aliases:['tolerance']}),
 entity('LearningObjective',6,{text:'Calculate a resistance tolerance interval.',evidence:[ref(4)]}),
 entity('ContentBlock',7,{type:'concept',title:'Tolerance',text:'Tolerance expresses a nominal interval.',origin:'source-derived',evidence:[ref(4)]}),
 entity('TopicRevision',8,{topicId:uid(5),version:'1.0.0',status:'draft',blockIds:[uid(7)],objectiveIds:[uid(6)],evidence:[ref(4)],supersedes:null}),
 entity('LessonDefinition',9,{title:'Resistors',aliases:['resistors'],description:'Synthetic fixture; never published.'}),
 entity('AssessmentTemplate',10,{version:'1.0.0',status:'reviewed',type:'parameterized-number',prompt:'Calculate current for {{voltage}} V and {{resistance}} Ω.',explanation:'Use I = V/R.',parameters:[{name:'voltage',values:[5,10]},{name:'resistance',values:[1000,2000]}],constraints:[{op:'positive',inputs:['resistance']}],choices:[],renderer:'numeric-unit@1',evaluator:{op:'ohm-current',inputs:['voltage','resistance']},unit:'A',tolerance:{absolute:.000001,relative:.001},safety:false,evidence:[ref(4)]}),
 entity('LabModuleReference',11,{version:'1.0.0',platform:'desktop',adapter:'desktop-lab@1',activityIds:[uid(21)],capabilities:[{widgetId:'dmm-shared',version:'1.0.0'}],evidence:[ref(4)]}),
 entity('LabModuleReference',12,{version:'1.0.0',platform:'mobile',adapter:'mobile-lab@1',activityIds:[uid(22)],capabilities:[{widgetId:'dmm-shared',version:'1.0.0'}],evidence:[ref(4)]}),
 entity('LessonRevision',13,{lessonId:uid(9),version:'1.0.0',status:'draft',topicRevisions:[ref(8)],additionalBlockIds:[],assessments:[ref(10)],objectives:[uid(6)],prerequisites:[],labs:{completionPolicy:'either-platform',desktop:ref(11),mobile:ref(12)},supersedes:null}),
 entity('PresentationProfile',14,{version:'1.0.0',name:'Classic five tabs',renderer:'classic-five-tab@1',regions:[{name:'learn',blockTypes:['concept']}]})
]};}
