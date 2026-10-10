// Activity access rules are deployed to sunnylist-1f5a2.
export const activityEnabled = true;
export const activityLabels = { created: 'created the shared plan', joined: 'joined the plan', renamed: 'renamed the plan', stops: 'updated the stops', reordered: 'reordered the itinerary', progress: 'updated shared progress', dates: 'updated trip dates', budget: 'updated the budget', invited: 'created an invitation', invitation: 'disabled an invitation', members: 'updated membership', restored: 'restored the plan', deleted: 'moved the plan to trash', voted: 'updated a vote', shared: 'updated public sharing' };
export function activityAction(update) {
  const keys = Object.keys(update);
  if (keys.includes('title')) return 'renamed';
  if (keys.includes('bucketItems')) return 'stops';
  if (keys.includes('stopOrder')) return 'reordered';
  if (keys.includes('budget')) return 'budget';
  if (keys.includes('deletedAt')) return update.deletedAt ? 'deleted' : 'restored';
  if (keys.some((key) => key.startsWith('completedItems'))) return 'progress';
  if (keys.some((key) => key === 'trip' || key.startsWith('scheduledItems'))) return 'dates';
  return null;
}
