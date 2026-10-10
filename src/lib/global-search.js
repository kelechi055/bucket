import { listTitle } from './list-planning.js';
export function normalizeQuery(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
export function searchCatalog(guides, lists, query, type = 'all', city = '') {
  const needle = normalizeQuery(query), words = needle.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const records = [];
  for (const guide of guides) {
    if (city && city !== guide.id) continue;
    records.push({ id: `city:${guide.id}`, type: 'cities', title: guide.city, description: guide.description || guide.title, context: `${guide.city}, ${guide.state}`, href: `/guides?city=${guide.id}` });
    guide.bucketItems.forEach((item, i) => records.push({ id: `place:${guide.id}:${i}`, type: 'places', title: item.title, description: item.description, context: `${guide.city}, ${guide.state} · ${(item.tags || []).join(' · ')} ${item.cuisine || ''}`, href: `/guides?city=${guide.id}` }));
  }
  for (const list of lists.filter((entry) => !entry.deletedAt)) {
    const context = list.destination || list.userInfo?.location || '';
    if (city && list.sourceGuideId !== city && !normalizeQuery(context).includes(normalizeQuery(guides.find((g) => g.id === city)?.city || 'UNMATCHED'))) continue;
    const href = `/save#list-${encodeURIComponent(list.id)}`;
    records.push({ id: `list:${list.id}`, type: 'lists', title: listTitle(list), description: `${list.bucketItems?.length || 0} stops${list.teamId ? ' · Shared plan' : ''}`, context, href });
    (list.bucketItems || []).forEach((item, i) => records.push({ id: `stop:${list.id}:${i}`, type: 'stops', title: item.title, description: item.description, context: `${listTitle(list)} · ${context} · ${(item.tags || []).join(' · ')}`, href }));
  }
  return records.filter((record) => (type === 'all' || record.type === type) && words.every((word) => normalizeQuery(`${record.title} ${record.description} ${record.context}`).includes(word)))
    .sort((a, b) => Number(normalizeQuery(b.title).startsWith(needle)) - Number(normalizeQuery(a.title).startsWith(needle)) || a.title.localeCompare(b.title));
}
