'use client';
import { useEffect, useState } from 'react';
import { loadCollaborators, watchPlanActivity } from '../../lib/saved-lists';
import { activityLabels, activityEnabled } from '../../lib/collaboration-activity';
export function TeamActivity({ list, userId, getToken, onMembers }) {
  const [entries, setEntries] = useState([]), [members, setMembers] = useState([]), [error, setError] = useState(''), [profileError, setProfileError] = useState('');
  const memberKey = list.memberIds.join(',');
  useEffect(() => {
    let active = true, stop;
    const controller = new AbortController();
    loadCollaborators(userId, getToken, { teamId: list.teamId }, controller.signal).then((profiles) => { if (active) { setMembers(profiles); onMembers(profiles); } }).catch(() => { if (active) setProfileError('Member names are temporarily unavailable.'); });
    watchPlanActivity(userId, getToken, { teamId: list.teamId }, (data) => { if (active) setEntries(data); }, () => { if (active) { setEntries([]); setError('Recent activity is unavailable.'); } }).then((unsubscribe) => { if (active) stop = unsubscribe; else unsubscribe(); }).catch(() => { if (active) setError('Recent activity is unavailable.'); });
    return () => { active = false; stop?.(); controller.abort(); };
  }, [userId, getToken, list.teamId, memberKey, onMembers]);
  return <section className="mt-5 border-t border-amber-200 pt-4"><h4 className="text-sm font-bold">Recent activity</h4>{profileError && <p className="mt-2 text-xs text-stone-500">{profileError}</p>}{error ? <p role="status" className="mt-2 text-sm text-stone-500">{error}</p> : <ol className="mt-3 max-h-64 space-y-3 overflow-auto">{entries.map((entry) => { const name = entry.actorId === userId ? 'You' : members.find((person) => person.id === entry.actorId)?.name || (list.memberIds.includes(entry.actorId) ? 'A collaborator' : 'A former member'); return <li key={entry.id} className="text-sm"><span className="font-semibold">{name}</span> {activityLabels[entry.action] || 'updated the plan'}<time className="mt-0.5 block text-xs text-stone-500">{entry.createdAt?.toDate?.().toLocaleString() || 'Saving…'}</time></li>; })}{!entries.length && <li className="text-sm text-stone-500">{activityEnabled ? "New changes to this plan will appear here." : "Activity tracking is ready and awaiting activation."}</li>}</ol>}</section>;
}
