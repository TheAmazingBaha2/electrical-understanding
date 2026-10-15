// Developer preflight only. Runtime keeps exact frozen manifests and presentations.
import {artifactHash} from '../../modular/repositories.js';
import {additionRequirementDescriptor} from '../../study-additions.js';
export async function verifyStudyAdditionRequirements(bank){
 for(const addition of bank.additions||[]){
  if(addition.requirementHash!==await artifactHash(additionRequirementDescriptor(addition)))throw Error('Missing or mismatched supplemental requirement hash: '+addition.id+'@'+addition.version);
 }
 return bank;
}
