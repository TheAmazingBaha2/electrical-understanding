import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderScanInbox} from '../scan-inbox.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const scan=read('scan-inbox.js'),sql=read('supabase/migrations/20261012194500_private_book_catalog.sql');
const styles=read('styles.css');
const sources=scan.replace(/^import .*?;\s*$/gm,'').replace(/\bexport\s+(?=(?:async\s+)?(?:function|const|let)\b)/g,'');
const catalogBookTitle=new Function(sources+';return catalogBookTitle;')();

test('upload offers saved book chooser instead of repeated manual typing',()=>{
 const html=renderScanInbox({id:'signed-in-owner'});
 assert.match(html,/<select id="scan-book" required/);
 assert.doesNotMatch(html,/id="scan-book" type="text"/);
 assert.match(html,/id="scan-book-refresh"/);
 assert.match(html,/id="scan-add-book"/);
});
test('new book metadata form is optional and separate from paid AI controls',()=>{
 const html=renderScanInbox({id:'owner'});
 assert.match(html,/id="scan-new-book-title"/);
 assert.match(html,/id="scan-new-book-author"/);
 assert.match(html,/id="scan-new-book-edition"/);
 assert.match(html,/type="button" class="primary small-button" id="scan-add-book"/);
 assert.match(html,/does not upload an entire book or use AI credits/);
});
test('book labels preserve older full titles and distinguish editions',()=>{
 assert.equal(catalogBookTitle({title:'Associate CET Study Guide'}),'Associate CET Study Guide');
 assert.equal(catalogBookTitle({title:'Teach Yourself Electricity and Electronics',edition:'7th edition'}),
  'Teach Yourself Electricity and Electronics (7th edition)');
});
test('book choice controls scan source title and track',()=>{
 assert.match(scan,/selectedBook\?catalogBookTitle\(selectedBook\)/);
 assert.match(scan,/root\.querySelector\('#scan-track'\)\.value=chosen\.source_track/);
 assert.match(scan,/book\.length>180/);
 assert.match(scan,/selectedBook\?catalogBookTitle\(selectedBook\)/);
});
test('existing source citation edits also become books',()=>{
 assert.match(scan,/rememberBook\(editedBook,editedTrack\)/);
 assert.match(sql,/from public\.scan_lesson_jobs s/);
 assert.match(sql,/on conflict do nothing/);
});
test('book catalog is private, owner scoped and persistent',()=>{
 assert.match(sql,/create table if not exists public\.study_books/);
 assert.match(sql,/alter table public\.study_books enable row level security/);
 assert.match(sql,/create policy study_books_self_select/);
 assert.match(sql,/create policy study_books_self_insert/);
 assert.match(sql,/using \(auth\.uid\(\)=user_id\)/);
 assert.match(sql,/with check \(auth\.uid\(\)=user_id\)/);
 assert.match(scan,/\.from\('study_books'\)/);
});
test('adding or choosing book never invokes paid model pipeline',()=>{
 const start=scan.indexOf("const bookSelect=root.querySelector('#scan-book')");
 const end=scan.indexOf('const invoke=async body=>',start);
 assert.ok(start>=0&&end>start);
 const catalogHandlers=scan.slice(start,end);
 assert.doesNotMatch(catalogHandlers,/runStage\(|scan-lesson-pipeline/);
 assert.match(catalogHandlers,/supabase\.from\('study_books'\)\.insert/);
});
test('book selector stacks and add panel can be fully hidden on mobile',()=>{
 assert.match(styles,/\.scan-book-picker-row,\.scan-new-book-grid\{grid-template-columns:1fr\}/);
 assert.match(styles,/\.scan-new-book-panel\[hidden\]\{display:none!important\}/);
});
