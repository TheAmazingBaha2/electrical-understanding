// Portable domain contracts. No DOM, filesystem, network, database or native-shell API.
export const DOMAIN_SCHEMA_VERSION = 3;
const str = {type:'string',minLength:1,pattern:'\\S'};
const uuid = {type:'string',pattern:'^[0-9a-f]{8}-[0-9a-f]{4}-[457][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'};
const semver = {type:'string',pattern:'^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)$'};
const hash = {type:'string',pattern:'^[0-9a-f]{64}$'};
const number = {type:'number'};
const bool = {type:'boolean'};
const nullable = schema => ({anyOf:[schema,{type:'null'}]});
const list = (items,minItems=0) => ({type:'array',items,minItems});
const enumeration = values => ({enum:values});
const object = (properties,required=Object.keys(properties)) => ({type:'object',properties,required,additionalProperties:false});
const ref = object({id:uuid,version:semver});
const ids = list(uuid);
const refs = list(ref);
const record = (kind,properties,optional=[]) => object({schemaVersion:{const:3},kind:{const:kind},id:uuid,...properties},['schemaVersion','kind','id',...Object.keys(properties).filter(k=>!optional.includes(k))]);
export const BLOCK_TYPES = ['concept','definition','procedure','safety-note','worked-example','formula','figure','prediction','discussion','reference','assessment-launcher','lab-launcher'];
export const DISPOSITIONS = ['MIGRATED_EQUIVALENT','MIGRATED_EXPANDED','MERGED_INTO_TOPIC','SPLIT_ACROSS_TOPICS','HISTORICAL_ONLY','DUPLICATE','SUPERSEDED','INTENTIONALLY_RETIRED','REQUIRES_REVIEW'];
export const COMPLETION_POLICIES = ['either-platform','both-platforms','no-required-lab'];
const pageRange = object({start:{type:'integer',minimum:1},end:{type:'integer',minimum:1}});
const positive={type:'number',minimum:.000000001};
const rubric={anyOf:[
 object({kind:{const:'divider-voltage@1'},sourceVolts:positive,upperOhms:positive,lowerOhms:positive,fault:enumeration(['none','upper-open','lower-open','source-open']),expectedVolts:number,tolerance:{type:'number',minimum:0}}),
 object({kind:{const:'meter-state@1'},mode:enumeration(['voltage','resistance','continuity','current']),powered:bool,redRole:enumeration(['source','output','common']),blackRole:enumeration(['source','output','common']),expectedValue:number,tolerance:{type:'number',minimum:0},branchRole:enumeration(['upper','lower']),magnitude:bool},['kind','mode','powered','redRole','blackRole','expectedValue','tolerance']),
 object({kind:{const:'resistor-bands@1'},nominalOhms:positive,tolerancePercent:{type:'number',minimum:0,maximum:20},bandCount:enumeration([4,5])})
]};
const defs = {
 SourceWork:record('SourceWork',{title:str,authors:list(str),publisher:nullable(str)}),
 SourceEdition:record('SourceEdition',{workId:uuid,edition:nullable(str),isbn:nullable(str),fingerprint:nullable(hash),status:enumeration(['metadata-only','preserved-artifact','source-verified'])}),
 SourceLocator:record('SourceLocator',{editionId:uuid,chapter:nullable(str),section:nullable(str),printedPages:nullable(pageRange),digitalPages:nullable(pageRange),pageLabel:nullable(str),citation:str,verification:enumeration(['preserved-reference','source-verified','unresolved'])}),
 EvidenceClaim:record('EvidenceClaim',{version:semver,claimType:enumeration(['definition','fact','procedure','formula','safety-rule','convention','worked-example','troubleshooting','terminology','source-distinction']),text:str,state:enumeration(['active','superseded','disputed','source-specific','historical','under-review']),locatorIds:list(uuid,1),conflictsWith:refs}),
 Topic:record('Topic',{title:str,aliases:list(str)}),
 LearningObjective:record('LearningObjective',{text:str,evidence:refs}),
 ContentBlock:record('ContentBlock',{type:enumeration(BLOCK_TYPES),title:str,text:str,origin:enumeration(['source-derived','authored-example','source-independent']),evidence:refs,assetKey:str,hint:str,debrief:str,choices:list(str),correctIndex:{type:'integer',minimum:0}},['assetKey','hint','debrief','choices','correctIndex']),
 TopicRevision:record('TopicRevision',{topicId:uuid,version:semver,status:enumeration(['draft','reviewed','published']),blockIds:ids,objectiveIds:ids,evidence:refs,supersedes:nullable(ref),title:str,aliases:list(str)},['title','aliases']),
 TopicRelation:record('TopicRelation',{fromTopicId:uuid,toTopicId:uuid,relation:enumeration(['broader','narrower','prerequisite','related','contrasts-with','applies-to','supersedes']),rationale:str}),
 LessonDefinition:record('LessonDefinition',{title:str,aliases:list(str),description:str}),
 LessonRevision:record('LessonRevision',{lessonId:uuid,version:semver,status:enumeration(['draft','reviewed','published']),topicRevisions:refs,additionalBlockIds:ids,assessments:refs,objectives:ids,prerequisites:refs,labs:object({completionPolicy:enumeration(COMPLETION_POLICIES),desktop:nullable(ref),mobile:nullable(ref)}),supersedes:nullable(ref),title:str,description:str,reviewPolicy:object({id:{const:'common-review@1'},passFraction:{const:.8},missedDays:{const:1},initialSuccessDays:{const:7},retrySuccessDays:{const:21}})},['title','description','reviewPolicy']),
 AssessmentTemplate:record('AssessmentTemplate',{version:semver,status:enumeration(['draft','reviewed','published']),type:enumeration(['static-choice','parameterized-number']),prompt:str,explanation:str,parameters:list(object({name:{type:'string',pattern:'^[a-z][a-zA-Z0-9_]*$'},values:list(number,1)})),constraints:list(object({op:enumeration(['positive','nonzero','greater-than']),inputs:list(str,1)})),choices:list(str),renderer:enumeration(['selectable-choice@1','numeric-unit@1','resistor-bands@1']),evaluator:object({op:enumeration(['choice','ohm-current','ohm-voltage','voltage-difference','voltage-divider','series-resistance','parallel-resistance','tolerance-lower','tolerance-upper','four-band-value','five-band-value']),inputs:list(str),correctIndex:{type:'integer',minimum:0}},['op','inputs']),unit:enumeration(['','V','A','Ω']),tolerance:object({absolute:{type:'number',minimum:0},relative:{type:'number',minimum:0,maximum:1}}),safety:bool,evidence:refs,objectiveIds:ids},['objectiveIds']),
 AssessmentInstance:record('AssessmentInstance',{template:ref,templateHash:hash,seed:str,generator:{const:'finite-product@1'},parameters:list(object({name:str,value:number})),expected:number,unit:enumeration(['','V','A','Ω'])}),
 LabModuleReference:record('LabModuleReference',{version:semver,platform:enumeration(['desktop','mobile']),adapter:enumeration(['desktop-lab@1','mobile-lab@1']),activityIds:list(uuid,1),capabilities:list(object({widgetId:str,version:semver})),evidence:refs,definition:ref},['definition']),
 LabModuleDefinition:record('LabModuleDefinition',{version:semver,platform:enumeration(['desktop','mobile']),status:enumeration(['draft','reviewed','published']),activities:list(object({id:uuid,title:str,prompt:str,hint:str,explanation:str,required:bool,objectiveIds:ids,evidence:refs,rubric}),1)}),
 PresentationProfile:record('PresentationProfile',{version:semver,name:str,renderer:enumeration(['classic-five-tab@1','linear-reading@1']),regions:list(object({name:str,blockTypes:list(enumeration(BLOCK_TYPES))}))}),
 ProgressEvent:record('ProgressEvent',{streamId:uuid,eventType:enumeration(['question-attempt','question-result','lab-attempt','lab-result','completion','review-scheduled']),lesson:ref,subject:ref,platform:enumeration(['core','desktop','mobile']),module:ref,attemptId:uuid,sequence:{type:'integer',minimum:0},timestamp:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z$'},instanceId:uuid,correct:bool,reviewDue:{type:'string',minLength:1}},['module','instanceId','correct','reviewDue']),
 LegacyMapping:record('LegacyMapping',{legacyKind:enumeration(['lesson','question','activity','source-reference']),legacyId:str,lessonId:str,sourceArtifactHash:hash,disposition:enumeration(DISPOSITIONS),targets:list(object({kind:str,id:uuid,version:semver},['kind','id'])),credit:enumeration(['none','explicit-equivalent']),notes:str}),
 IngestionBatch:record('IngestionBatch',{editionIds:ids,inputHash:hash,status:enumeration(['received','proposed','reviewed','rejected']),gaps:list(str)}),
 IngestionProposal:record('IngestionProposal',{batchId:uuid,decision:enumeration(['EXTEND_TOPIC','CREATE_SUBTOPIC','CREATE_TOPIC','CONFLICT','DEFER','DUPLICATE','CREATE_LESSON','SPLIT_LESSON','MERGE_LESSONS']),confidence:{type:'number',minimum:0,maximum:1},reason:str,existingTopicIds:ids,evidence:refs,proposedEntityIds:ids,review:enumeration(['pending','approved','rejected'])}),
};
export const ENTITY_KINDS = Object.freeze(Object.keys(defs));
export const CONTENT_KINDS = Object.freeze(ENTITY_KINDS.filter(k=>!['ProgressEvent','AssessmentInstance','LegacyMapping','IngestionBatch','IngestionProposal'].includes(k)));
defs.Bundle=object({schemaVersion:{const:3},id:uuid,version:semver,entities:list({anyOf:CONTENT_KINDS.map(k=>({$ref:'#/$defs/'+k}))})});
export const domainSchema = {$schema:'https://json-schema.org/draft/2020-12/schema',$id:'urn:electrical-workbench:domain:3',title:'Electrical Workbench modular domain v3',$defs:defs};
