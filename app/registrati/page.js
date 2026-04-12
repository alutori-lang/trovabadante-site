'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TIPI = [{key:'convivente',label:'Convivente (h24)'},{key:'a_ore',label:'A Ore'},{key:'notturna',label:'Notturna'}];
const NAZ = ['Italiana','Rumena','Ucraina','Moldava','Filippina','Peruviana','Ecuadoriana','Cingalese','Georgiana','Altra'];
const BAND = {Italiana:'🇮🇹',Rumena:'🇷🇴',Ucraina:'🇺🇦',Moldava:'🇲🇩',Filippina:'🇵🇭',Peruviana:'🇵🇪',Ecuadoriana:'🇪🇨',Cingalese:'🇱🇰',Georgiana:'🇬🇪',Altra:'🌍'};
const LINGUE = ['Italiano','Rumeno','Ucraino','Russo','Inglese','Spagnolo','Tagalog'];
const SKILLS = ['Alzheimer','Parkinson','Diabete','Iniezioni','Gestione farmaci','Igiene personale','Deambulazione','Carrozzina','Cucina','Pulizia casa','Compagnia','Accompagnamento visite'];
const CITTA = ['Milano','Roma','Torino','Napoli','Bologna','Firenze','Genova','Palermo','Bari','Catania','Venezia','Verona','Padova','Brescia','Parma','Modena'];

export default function Registrati(){
  const [step,setStep]=useState(1);
  const [saving,setSaving]=useState(false);
  const [done,setDone]=useState(false);
  const [err,setErr]=useState('');
  const [f,setF]=useState({nome:'',cognome:'',eta:'',naz:'',citta:'',cittaAlt:'',tipo:'',po:'',pm:'',lingue:['Italiano'],skills:[],exp:'',spec:'',desc:'',tel:'',email:''});
  const up=(k,v)=>setF(p=>({...p,[k]:v}));
  const tog=(k,v)=>setF(p=>{const a=p[k];return{...p,[k]:a.includes(v)?a.filter(x=>x!==v):[...a,v]};});
  const ok=()=>{
    if(step===1)return f.nome&&f.cognome&&f.eta&&f.naz;
    if(step===2)return f.tipo&&(f.citta||f.cittaAlt);
    if(step===3)return f.lingue.length>0&&f.skills.length>=2;
    return f.desc.length>=30;
  };

  const submit=async()=>{
    setSaving(true);setErr('');
    try{
      await addDoc(collection(db,'badanti'),{
        nome:f.nome.trim(),cognome:f.cognome.trim(),eta:parseInt(f.eta)||0,
        foto:'',rating:0,recensioni:0,
        specialita:f.spec||('Badante '+f.tipo),tipo:f.tipo,
        prezzoOra:f.tipo==='a_ore'?(parseInt(f.po)||0):0,
        prezzoMese:f.tipo!=='a_ore'?(parseInt(f.pm)||0):0,
        disponibileOra:true,hasVideo:false,videoUrl:'',
        nazionalita:f.naz,bandiera:BAND[f.naz]||'',
        lingue:f.lingue,skills:f.skills,
        anniEsperienza:parseInt(f.exp)||0,
        descrizione:f.desc.trim(),inEvidenza:false,
        citta:f.citta||f.cittaAlt,uid:'',
        telefono:f.tel,email:f.email,
        fonte:'sito-web',
        createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
      });
      setDone(true);
    }catch(e){console.error(e);setErr('Errore, riprova.');}
    setSaving(false);
  };

  if(done) return(
    <>
      <header className="header"><div className="header-top"><a href="/" className="logo">Trova<span>Badante</span></a></div></header>
      <div className="reg-success">
        <div className="reg-success-icon">&#10003;</div>
        <h2>Registrazione completata!</h2>
        <p>Il tuo profilo e ora visibile alle famiglie.</p>
        <a href="/" className="cta-btn">Torna alla Home</a>
      </div>
    </>
  );

  return(
    <>
      <header className="header"><div className="header-top"><a href="/" className="logo">Trova<span>Badante</span></a></div></header>
      <div className="reg-container">
        <div className="reg-header">
          <h1>Registrati come Badante</h1>
          <p>Crea il tuo profilo gratuito e fatti trovare dalle famiglie in tutta Italia</p>
        </div>

        <div className="reg-progress">
          {[1,2,3,4].map(s=>(
            <div key={s} className={"reg-step-dot"+(step>=s?" active":"")+(step===s?" current":"")}>{s}</div>
          ))}
        </div>

        <div className="reg-form">
          {step===1 && (
            <div className="reg-step">
              <h2>Dati personali</h2>
              <div className="reg-row">
                <div className="reg-field"><label>Nome *</label><input placeholder="Il tuo nome" value={f.nome} onChange={e=>up('nome',e.target.value)}/></div>
                <div className="reg-field"><label>Cognome *</label><input placeholder="Il tuo cognome" value={f.cognome} onChange={e=>up('cognome',e.target.value)}/></div>
              </div>
              <div className="reg-row">
                <div className="reg-field"><label>Eta *</label><input type="number" placeholder="Anni" min="18" max="75" value={f.eta} onChange={e=>up('eta',e.target.value)}/></div>
                <div className="reg-field"><label>Nazionalita *</label>
                  <select value={f.naz} onChange={e=>up('naz',e.target.value)}>
                    <option value="">Seleziona...</option>
                    {NAZ.map(n=><option key={n} value={n}>{BAND[n]} {n}</option>)}
                  </select>
                </div>
              </div>
              <div className="reg-row">
                <div className="reg-field"><label>Esperienza (anni)</label><input type="number" placeholder="0" min="0" value={f.exp} onChange={e=>up('exp',e.target.value)}/></div>
                <div className="reg-field"><label>Telefono</label><input type="tel" placeholder="+39 333 1234567" value={f.tel} onChange={e=>up('tel',e.target.value)}/></div>
              </div>
              <div className="reg-field"><label>Email (opzionale)</label><input type="email" placeholder="email@esempio.com" value={f.email} onChange={e=>up('email',e.target.value)}/></div>
            </div>
          )}

          {step===2 && (
            <div className="reg-step">
              <h2>Tipo di servizio</h2>
              <div className="reg-tipo-grid">
                {TIPI.map(t=>(
                  <button key={t.key} className={"reg-tipo-card"+(f.tipo===t.key?" selected":"")} onClick={()=>up('tipo',t.key)}>
                    <strong>{t.label}</strong>
                  </button>
                ))}
              </div>
              <div className="reg-field" style={{marginTop:24}}>
                <label>Citta *</label>
                <select value={f.citta} onChange={e=>up('citta',e.target.value)}>
                  <option value="">Seleziona citta...</option>
                  {CITTA.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                {!f.citta && <input placeholder="Scrivi la tua citta" value={f.cittaAlt} onChange={e=>up('cittaAlt',e.target.value)} style={{marginTop:8}}/>}
              </div>
              <div className="reg-field">
                <label>{f.tipo==='a_ore' ? 'Prezzo EUR/ora' : 'Prezzo EUR/mese'}</label>
                {f.tipo==='a_ore'
                  ? <input type="number" placeholder="es. 10" value={f.po} onChange={e=>up('po',e.target.value)}/>
                  : <input type="number" placeholder={f.tipo==='notturna'?'es. 850':'es. 1200'} value={f.pm} onChange={e=>up('pm',e.target.value)}/>
                }
              </div>
              <div className="reg-field"><label>Specialita (opzionale)</label><input placeholder="es. Esperta Alzheimer..." value={f.spec} onChange={e=>up('spec',e.target.value)}/></div>
            </div>
          )}

          {step===3 && (
            <div className="reg-step">
              <h2>Lingue e competenze</h2>
              <div className="reg-field">
                <label>Lingue parlate *</label>
                <div className="reg-tags-grid">
                  {LINGUE.map(l=><button key={l} className={"reg-tag"+(f.lingue.includes(l)?" selected":"")} onClick={()=>tog('lingue',l)}>{l}</button>)}
                </div>
              </div>
              <div className="reg-field">
                <label>Competenze * (seleziona almeno 2)</label>
                <div className="reg-tags-grid">
                  {SKILLS.map(s=><button key={s} className={"reg-tag"+(f.skills.includes(s)?" selected":"")} onClick={()=>tog('skills',s)}>{s}</button>)}
                </div>
              </div>
            </div>
          )}

          {step===4 && (
            <div className="reg-step">
              <h2>Presentati alle famiglie</h2>
              <div className="reg-field">
                <label>Descrizione * (minimo 30 caratteri)</label>
                <textarea placeholder="Racconta la tua esperienza, le tue qualita..." rows={6} value={f.desc} onChange={e=>up('desc',e.target.value)}/>
                <span className="reg-char-count">{f.desc.length} / 30 min</span>
              </div>
              <div className="reg-summary">
                <h3>Riepilogo</h3>
                <div className="reg-summary-grid">
                  <div><strong>Nome:</strong> {f.nome} {f.cognome}</div>
                  <div><strong>Eta:</strong> {f.eta} anni</div>
                  <div><strong>Nazionalita:</strong> {f.naz}</div>
                  <div><strong>Citta:</strong> {f.citta || f.cittaAlt}</div>
                  <div><strong>Tipo:</strong> {f.tipo}</div>
                  <div><strong>Prezzo:</strong> {f.tipo==='a_ore' ? f.po+'/ora' : f.pm+'/mese'}</div>
                </div>
              </div>
              {err && <div className="reg-error">{err}</div>}
            </div>
          )}

          <div className="reg-nav">
            {step>1 && <button className="reg-btn-back" onClick={()=>setStep(s=>s-1)}>Indietro</button>}
            {step<4
              ? <button className="reg-btn-next" disabled={!ok()} onClick={()=>setStep(s=>s+1)}>Avanti</button>
              : <button className="reg-btn-submit" disabled={!ok()||saving} onClick={submit}>{saving ? 'Salvataggio...' : 'Pubblica il tuo profilo'}</button>
            }
          </div>
        </div>
      </div>
    </>
  );
}
