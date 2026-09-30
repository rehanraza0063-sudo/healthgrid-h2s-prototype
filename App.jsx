import {useState,useCallback} from 'react';
import {LayoutDashboard,Building2,BedDouble,Pill,Stethoscope,Users,Share2,Bell,Bot,Search,Siren,Menu,HeartPulse} from 'lucide-react';
import Dashboard,{Alerts,Population,Emergency} from './pages/Dashboard';
import {FacilityList,FacilityDetail,Beds} from './pages/Facilities';
import {Medicines,Equipment} from './pages/Inventory';
import Network from './pages/Network';
import Assistant from './pages/Assistant';
import BookingModal from './components/Booking';
import useLocal from './hooks/useLocal';
import {fac} from './services/resources';
import {alerts,medicines,equipment} from './data/mockData';

const NAV=[['overview','Overview',LayoutDashboard],['facilities','Facilities',Building2],['beds','Beds',BedDouble],['medicines','Medicines',Pill],['equipment','Equipment',Stethoscope],
['population','Population',Users],['network','Resource Network',Share2],['alerts','Alerts',Bell],['assistant','AI Assistant',Bot]];

export default function App(){
  const [nav,setNav]=useState({page:'overview'}),[q,setQ]=useState(''),[emg,setEmg]=useState(false),[menu,setMenu]=useState(false);
  const [reservations,setRes]=useLocal('hg-reservations',[]);
  const [bookReq,setBookReq]=useState(null),[toasts,setToasts]=useState([]);
  const toast=useCallback(m=>{const id=Date.now()+Math.random();setToasts(t=>[...t,{id,m}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500)},[]);
  const go=(page,fid,type)=>{setNav({page,fid,type});setMenu(false);window.scrollTo(0,0)};
  const ctx={go,open:id=>go('facility',id),q,reservations,toast,book:setBookReq,clearRes:()=>setRes([]),
    resolved:a=>a.id==='a3'&&reservations.some(r=>r.origin==='dharavi'),
    approveTransfer:t=>toast(`Simulated transfer approved: ${t.units} units of ${t.name} → ${t.to.name}`)};
  const onBook=f=>{const r={...f,id:'HG-2026-'+Math.floor(10000+Math.random()*90000),status:'Reserved'};setRes(x=>[r,...x]);toast(`Bed reserved (${r.id}) — simulation`);return r};
  const search=e=>{if(e.key!=='Enter'||!q.trim())return;const s=q.toLowerCase();
    go(medicines.some(m=>m.name.toLowerCase().includes(s))?'medicines':equipment.some(x=>x.name.toLowerCase().includes(s))?'equipment':'facilities')};
  const p=nav.page,active=alerts.filter(a=>!ctx.resolved(a)).length;
  return <div className="min-h-screen flex">
    <aside className={`fixed md:sticky top-0 h-screen z-[1500] w-60 bg-slate-900 text-slate-200 flex flex-col p-4 transition-transform ${menu?'':'-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center gap-2 text-white mb-6"><span className="p-2 rounded-xl bg-teal-500"><HeartPulse size={20}/></span><div><div className="font-bold leading-tight">HealthGrid</div><div className="text-[10px] text-slate-400">Know. Predict. Respond.</div></div></div>
      <nav className="space-y-1 flex-1">{NAV.map(([k,l,I])=><button key={k} onClick={()=>go(k)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${p===k||(k==='facilities'&&p==='facility')?'bg-teal-500/20 text-teal-300':'hover:bg-slate-800'}`}><I size={18}/>{l}</button>)}</nav>
      <div className="text-[11px] text-slate-400 border-t border-slate-700 pt-3">Prototype • Synthetic Data</div></aside>
    <div className="flex-1 min-w-0">
      <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center gap-3 flex-wrap">
        <button className="md:hidden" aria-label="Menu" onClick={()=>setMenu(m=>!m)}><Menu/></button>
        <div className="hidden lg:block"><div className="font-bold text-slate-800 leading-tight">HealthGrid</div><div className="text-[11px] text-slate-500">Smart Healthcare Resource &amp; Supply Intelligence Platform</div></div>
        <div className="flex-1 min-w-[180px] relative max-w-md"><Search size={16} className="absolute left-3 top-2.5 text-slate-400"/>
          <input aria-label="Search" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={search} placeholder="Search facilities, medicines, equipment…" className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl bg-white"/></div>
        <select aria-label="District" className="border rounded-lg px-2 py-2 text-sm bg-white"><option>Demo District</option></select>
        <button onClick={()=>setEmg(e=>{if(!e)go('overview');return !e})} className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ${emg?'bg-red-600 text-white animate-pulse':'bg-red-50 text-red-700 hover:bg-red-100'}`}><Siren size={16}/>{emg?'Exit Emergency':'Emergency Mode'}</button>
        <button aria-label="Notifications" onClick={()=>go('alerts')} className="relative p-2"><Bell size={20}/><span className="absolute -top-0.5 -right-0.5 text-[10px] bg-red-600 text-white rounded-full px-1">{active}</span></button>
        <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">DA</span><span className="hidden xl:block text-sm">District Health Admin</span></div></header>
      <main className="p-4 lg:p-6">
        {p==='overview'&&(emg?<Emergency ctx={ctx}/>:<Dashboard ctx={ctx}/>)}
        {p==='facilities'&&<FacilityList ctx={ctx}/>}
        {p==='facility'&&<FacilityDetail key={nav.fid} f={fac(nav.fid)} ctx={ctx}/>}
        {p==='beds'&&<Beds key={nav.fid+nav.type} ctx={ctx} initial={nav.fid?{fid:nav.fid,type:nav.type}:null}/>}
        {p==='medicines'&&<Medicines ctx={ctx}/>}{p==='equipment'&&<Equipment ctx={ctx}/>}{p==='population'&&<Population ctx={ctx}/>}
        {p==='network'&&<Network ctx={ctx}/>}{p==='alerts'&&<Alerts ctx={ctx}/>}{p==='assistant'&&<Assistant/>}</main></div>
    {bookReq&&<BookingModal req={bookReq} onClose={()=>setBookReq(null)} onBook={onBook}/>}
    <div className="fixed bottom-4 right-4 z-[3000] space-y-2" aria-live="polite">{toasts.map(t=><div key={t.id} className="bg-slate-900 text-white text-sm rounded-xl px-4 py-2 shadow-lg">{t.m}</div>)}</div></div>;
}
