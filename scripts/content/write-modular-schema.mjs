import {mkdir,writeFile} from 'node:fs/promises';
import {domainSchema} from '../../modular/contracts.js';
await mkdir(new URL('../../content/modular/',import.meta.url),{recursive:true});
await writeFile(new URL('../../content/modular/domain.schema.json',import.meta.url),JSON.stringify(domainSchema,null,2)+'\n');
console.log('Wrote independent Draft 2020-12 Schema V3 family; legacy schemas unchanged.');
