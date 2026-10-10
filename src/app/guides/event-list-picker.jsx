"use client";
import { useEffect, useState } from 'react';
import { loadBucketLists, watchCollaborativeLists, appendEvent } from '../../lib/saved-lists';
import { eventStop } from '../../lib/ticketmaster';
import { listTitle } from '../../lib/list-planning';
export default function EventListPicker({ event, userId, getToken, onClose }) {
  const [own, setOwn] = useState([]), [teams, setTeams] = useState([]), [selected, setSelected] = useState('');
  const [ready, setReady] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true, stop;
    loadBucketLists(userId, getToken).then((lists) => { if(active) { setOwn(lists); setReady(true); } }, () => { if(active) setError('Unable to load lists. Please try again.'); });
    watchCollaborativeLists(userId, getToken, (lists) => { if(active) setTeams(lists); }, () => { if(active) setError('Shared plans could not be loaded.'); }).then((unsubscribe) => { if(active) stop=unsubscribe; else unsubscribe(); }).catch(() => { if(active) setError('Unable to connect shared plans.'); });
    return () => { active=false; stop?.(); };
  }, [userId, getToken]);
  const lists = [...own, ...teams].filter((list) => !list.deletedAt);
  async function add(e) {
    e.preventDefault();setBusy(true);setError('');
    try { const list=lists.find((entry)=>entry.id===selected); if(!list) throw new Error('Choose a list.'); await appendEvent(userId,getToken,list,eventStop(event));setSaved(true); }
    catch(error){setError(error.message);} finally{setBusy(false);}
  }
  return <form onSubmit={add} className="mt-4 rounded-xl bg-amber-50 p-4"><label className="block text-sm font-semibold">Add to a saved list<select disabled={busy || saved} value={selected} onChange={(e)=>setSelected(e.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white p-3"><option value="">{ready ? 'Choose a list' : 'Loading lists…'}</option>{lists.map((list)=><option key={list.id} value={list.id}>{listTitle(list)}{list.teamId ? ' · Shared plan' : ''}</option>)}</select></label>{ready && !lists.length && <p className="mt-2 text-sm">Create a list or save this event as a new list first.</p>}<div className="mt-3 flex flex-wrap gap-3"><button disabled={!selected || busy || saved} className="min-h-11 rounded-xl bg-amber-300 px-4 py-2 font-semibold disabled:opacity-50">{saved?'Added':busy?'Adding…':'Add event'}</button><button type="button" onClick={onClose} className="min-h-11 px-3">Close</button></div>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{saved && <p role="status" className="mt-3 text-sm">Event added. Its date is available for calendar export.</p>}</form>;
}
