import test from 'node:test';
import assert from 'node:assert/strict';
import { searchCatalog } from '../src/lib/global-search.js';
import { activityAction } from '../src/lib/collaboration-activity.js';
const guides = [{id:'boston',city:'Boston',state:'MA',title:'Boston guide',bucketItems:[{title:'Café Pizza',description:'Italian restaurant',tags:['Restaurants']}]},{id:'miami',city:'Miami',state:'FL',title:'Miami guide',bucketItems:[]}];
const lists = [{id:'team:abc',teamId:'abc',title:'Friends weekend',destination:'Boston MA',bucketItems:[{title:'Private museum',description:'Art'}]},{id:'deleted',deletedAt:'today',title:'Deleted museum',bucketItems:[]}];
test('unified search matches accents, multiple words, saved plans and scoped cities',()=>{
 assert.equal(searchCatalog(guides,lists,'cafe pizza')[0].title,'Café Pizza');
 assert.equal(searchCatalog(guides,lists,'pizza miami').length,0);
 assert.equal(searchCatalog(guides,lists,'museum')[0].href,'/save#list-team%3Aabc');
 assert.equal(searchCatalog(guides,lists,'museum','all','miami').length,0);
 assert.equal(searchCatalog(guides,lists,'Boston','cities').length,1);
 assert.equal(searchCatalog(guides,lists,'','all').length,0);
 assert.equal(searchCatalog(guides,[],'Private').length,0);
});
test('activity omits personal preferences and classifies shared edits',()=>{
 assert.equal(activityAction({'notes.0':'secret'}),null);
 assert.equal(activityAction({'completedItems.0':true}),'progress');
 assert.equal(activityAction({deletedAt:''}),'restored');
 assert.equal(activityAction({budget:{}}),'budget');
});
