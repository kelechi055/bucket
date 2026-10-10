import test from 'node:test';
import assert from 'node:assert/strict';
import { progressStatus, validateTrip, itineraryGroups, publicSnapshot } from '../src/lib/list-planning.js';

test('filters handle empty, untouched, partially complete and completed lists', () => {
  assert.equal(progressStatus({ bucketItems: [] }), 'not-started');
  const list = { bucketItems: [{ title: 'A' }, { title: 'B' }] };
  assert.equal(progressStatus(list), 'not-started');
  assert.equal(progressStatus({ ...list, completedItems: { 0: true, 9: true } }), 'in-progress');
  assert.equal(progressStatus({ ...list, completedItems: { 0: true, 1: true } }), 'completed');
});

test('trip dates reject invalid calendar dates, reversed ranges, and displaced stops', () => {
  assert.throws(() => validateTrip({ start: '2026-02-30', end: '2026-03-02' }));
  assert.throws(() => validateTrip({ start: '2026-10-12', end: '2026-10-11' }));
  assert.throws(() => validateTrip({ start: '2026-10-10', end: '2026-10-12' }, { 0: '2026-10-13' }));
  assert.throws(() => validateTrip({ start: '', end: '' }, { 0: '2026-10-10' }));
  assert.deepEqual(validateTrip({ start: '2028-02-29', end: '2028-02-29' }, { 0: '2028-02-29' }), { start: '2028-02-29', end: '2028-02-29' });
  assert.deepEqual(validateTrip({}, {}), { start: '', end: '' });
});

test('itinerary keeps original indexes and sorts days before unscheduled stops', () => {
  const groups = itineraryGroups([{ title: 'A' }, { title: 'B' }, { title: 'C' }], { 0: '2026-10-12', 2: '2026-10-10' });
  assert.deepEqual(groups.map(([date, stops]) => [date, stops[0].index]), [['2026-10-10', 2], ['2026-10-12', 0], ['', 1]]);
});

test('public copies exclude notes, trip dates, progress and profile data', () => {
  const copy = publicSnapshot({ title: 'Trip', userInfo: { name: 'Private', email: 'private@example.com' }, notes: { 0: 'Secret' }, trip: { start: '2026-10-10' }, completedItems: { 0: true }, bucketItems: [{ title: 'Museum', description: 'Visit', notes: 'Secret', location: 'https://example.com', tags: ['Art'], privateField: 'secret' }] });
  assert.equal(publicSnapshot({ userInfo: { name: 'Private name' }, bucketItems: [] }).title, 'Bucket List');
  assert.deepEqual(Object.keys(copy), ['title', 'bucketItems']);
  assert.deepEqual(copy.bucketItems[0], { title: 'Museum', description: 'Visit', tags: ['Art'], location: 'https://example.com' });
});

test('reordering preserves stop identities, notes, completion and dates', async () => {
  const { orderedStopIndices, moveStop } = await import('../src/lib/list-planning.js');
  const list = { bucketItems: [{title:'A'}, {title:'B'}, {title:'C'}], stopOrder: [2, 0, 1], notes: { 0: 'A note' }, completedItems: { 2: true }, scheduledItems: { 0:'2026-10-10', 2:'2026-10-10' } };
  const order = moveStop(orderedStopIndices(list), 0, 2);
  assert.deepEqual(order, [0, 2, 1]);
  assert.deepEqual(itineraryGroups(list.bucketItems, list.scheduledItems, order)[0][1].map(({index})=>index), [0,2]);
  assert.equal(list.notes[0], 'A note'); assert.equal(list.completedItems[2], true);
  assert.deepEqual(publicSnapshot({...list,stopOrder:order}).bucketItems.map((item)=>item.title), ['A','C','B']);
});

test('old lists and newly appended stops have a complete, unique order', async () => {
  const { orderedStopIndices } = await import('../src/lib/list-planning.js');
  assert.deepEqual(orderedStopIndices({ bucketItems:[{},{},{}] }), [0,1,2]);
  assert.deepEqual(orderedStopIndices({ bucketItems:[{},{},{}], stopOrder:[1,1,99,-1,'0'] }), [1,0,2]);
});

test('custom stops validate titles and websites and build an encoded map query', async () => {
  const { customStop, stopQuery } = await import('../src/lib/list-planning.js');
  assert.throws(()=>customStop({title:'   '}));
  assert.throws(()=>customStop({title:'Cafe',website:'javascript:alert(1)'}));
  const stop = customStop({title:'Cafe & Pie',address:'12 Main Street',category:'Restaurants',website:'https://example.com'}, 'Boston MA');
  assert.equal(stopQuery(stop), '12 Main Street Boston MA');
  assert.deepEqual(stop.tags, ['Restaurants']);
});
