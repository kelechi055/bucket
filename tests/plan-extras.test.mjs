import test from 'node:test';
import assert from 'node:assert/strict';
import { moneyCents, budgetTotal, travelLegs, directionsUrl } from '../src/lib/plan-extras.js';
test('budgets use integer cents, reject invalid money, and retain costs through reordering',()=>{
 assert.equal(moneyCents('12.05'),1205);assert.equal(moneyCents('0.1'),10);assert.equal(moneyCents(''),0);
 for(const value of ['-1','1.005','NaN','1e3','9,000'])assert.throws(()=>moneyCents(value));
 const list={bucketItems:[{title:'A'},{title:'B'}],stopOrder:[1,0],budget:{costs:{0:1205,1:10,99:500}}};
 assert.equal(budgetTotal(list),1215);
});
test('travel legs respect daily boundaries and itinerary order, encode destinations safely',()=>{
 const list={destination:'Boston MA',bucketItems:[{title:'First'},{title:'Second'},{title:'Another day'}],stopOrder:[1,0,2],scheduledItems:{0:'2026-10-12',1:'2026-10-12',2:'2026-10-13'}};
 const legs=travelLegs(list);assert.equal(legs.length,1);assert.equal(legs[0].from.index,1);assert.equal(legs[0].to.index,0);
 const url=new URL(directionsUrl(list,legs[0],'walking'));assert.equal(url.searchParams.get('origin'),'Second Boston MA');assert.equal(url.searchParams.get('travelmode'),'walking');
});
