import test from 'node:test';
import assert from 'node:assert/strict';
import {syncAllowed} from '../config.js';
test('official V2 sync accepts exact production addresses and denies V3 staging and other Pages paths',()=>{
 for(const u of ['https://electrical-understanding.vanguardcorbett.workers.dev/','https://theamazingbaha2.github.io/electrical-understanding/'])assert.equal(syncAllowed(new URL(u)),true);
 for(const u of ['https://eu-v2-staging.vanguardcorbett.workers.dev/','https://other.workers.dev/','https://theamazingbaha2.github.io/other/','http://electrical-understanding.vanguardcorbett.workers.dev/'])assert.equal(syncAllowed(new URL(u)),false);
});
