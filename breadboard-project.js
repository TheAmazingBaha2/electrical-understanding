import {newProject} from './project-store.js';
import {newBoardHistory,compileBreadboard} from './breadboard-model.js';
export function newBreadboardProject(){
 const p=newProject('breadboard-project');p.metadata.title='Editable breadboard';p.experimentState.breadboard=newBoardHistory();p.experimentState.guidance={mode:'free'};
 p.circuit=compileBreadboard(p.experimentState.breadboard.state);p.componentInventory=p.circuit.components.map(c=>({componentId:c.id,quantity:1}));p.widgetInstances[0].widgetId='breadboard-shared';return p;
}
