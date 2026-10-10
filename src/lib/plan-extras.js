import { itineraryGroups, orderedStopIndices, stopQuery } from './list-planning.js';
export function moneyCents(value) {
  const text = String(value).trim();
  if (!text) return 0;
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(text)) throw new Error('Use a nonnegative amount with up to two decimal places.');
  const [whole, fraction = ''] = text.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
export function budgetTotal(list) {
  return orderedStopIndices(list).reduce((sum, index) => {
    const value = list.budget?.costs?.[index];
    return sum + (Number.isSafeInteger(value) && value >= 0 ? value : 0);
  }, 0);
}
export function travelLegs(list) {
  return itineraryGroups(list.bucketItems || [], list.scheduledItems, orderedStopIndices(list)).flatMap(([date, stops]) => stops.slice(1).map((stop, index) => ({ date, from: stops[index], to: stop })));
}
export function directionsUrl(list, leg, mode = 'driving') {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', origin: stopQuery(leg.from.item, list.destination || list.userInfo?.location), destination: stopQuery(leg.to.item, list.destination || list.userInfo?.location), travelmode: ['driving','walking','transit'].includes(mode) ? mode : 'driving' })}`;
}
