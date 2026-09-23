import {useState} from 'react';
import {useDispatch,useStore} from '../state/store.jsx';
import {PERSONAL_RECIPES} from '../data/personal.js';
import {PERSONAL_MACROS,validProduct,mealFromProducts} from '../lib/personal.js';
import {todayKey} from '../lib/date.js';

const labels={kcal:'Kalorien (kcal)',protein:'Protein (g)',carbs:'Kohlenhydrate gesamt (g)',fat:'Fett (g)',fiber:'Ballaststoffe (g)'};
export function PersonalView({initialDate}){
  const state=useStore(),dispatch=useDispatch();
  const products=state.personalProducts;
  const [edit,setEdit]=useState(null),[date,setDate]=useState(initialDate||todayKey());
  const [name,setName]=useState('Meine Mahlzeit'),[meal,setMeal]=useState('breakfast'),[time,setTime]=useState('12:20');
  const [rows,setRows]=useState([{id:'yogurt',amount:1}]),[msg,setMsg]=useState('');
  const [accepted,setAccepted]=useState(false);
  function saveProduct(e){e.preventDefault();if(!validProduct(edit)){setMsg('Bitte alle Nährwerte als nicht negative Zahlen eintragen, auch Nullen.');return;}
    dispatch({type:'personalProduct',product:{...edit,...Object.fromEntries(PERSONAL_MACROS.map(k=>[k,Number(edit[k])])),verified:true}});setEdit(null);setMsg('Etikettwerte gespeichert.');}
  function plan(e){e.preventDefault();try{
    const entry=mealFromProducts(products,rows,name);
    dispatch({type:'personalPlan',dateKey:date,meal,time,entry});setMsg('Für '+date+' gespeichert. Sieh dir die neue Tagesbilanz unter Heute an.');
  }catch(e){setMsg(e.message);}}
  return <div className="stack stack--lg">
    <section className="card personal-card"><h2>Miami · Costco · dein Alltag</h2>
      <p>Eigene Produkte, feste Portionen und Getränke. Unbekannte Markenwerte werden nicht geraten. Die bisherigen Standardgerichte verwenden weiterhin allgemeine Schätzwerte.</p>
      <p><b>Start:</b> Persönliche Körperdaten und Ziele in den Einstellungen eintragen. Die Berechnung ist ein Ausgangspunkt, kein gemessener Bedarf. Nach 2 bis 3 Wochen Gewichtstrend, Hunger und Trainingsleistung abgleichen. Getränke zählen mit.</p>
      <button className="btn" onClick={()=>{dispatch({type:'hybridPreset'});setMsg('Hybrid-Rhythmus übernommen. Bestehende Tageseinträge bleiben erhalten und haben Vorrang.');}}>Hybrid-Rhythmus und Wochenrhythmus übernehmen</button>
      <p className="dim">Mo/Mi Kraft · Di/Do/Sa Ausdauer · Fr/So frei. Vorbereitung Mi/Sa. Handy und Tablet bleiben getrennt; Einstellungen → Export backup sichert auch deine Produkte.</p>
    </section>
    <section className="card personal-card"><h2>Deine Lebensmittel</h2><p>„Etikett prüfen“ bedeutet: noch nicht für Berechnungen freigegeben. Bezugsportion genau abschreiben, beispielsweise „2 Tortillas / 50 g“ oder „¼ Pizza / 138 g“. Bei US-Etiketten Total Carbohydrate nutzen, nicht Net Carbs.</p>
      <div className="personal-products">{products.map(p=><button className="btn personal-product" key={p.id} onClick={()=>{setEdit({...p});setAccepted(false);setMsg('');}}><b>{p.name}</b><span>{p.verified?`${p.kcal} kcal · ${p.serving}`:'Etikett prüfen'}</span></button>)}</div>
      <button className="btn" onClick={()=>{setEdit({id:'custom_'+Date.now(),name:'',serving:'',kcal:'',protein:'',carbs:'',fat:'',fiber:'',note:''});setAccepted(false);}}>Weiteres Produkt</button>
    </section>
    {edit&&<form className="card personal-card stack" onSubmit={saveProduct}>
      <h2>Etikettwerte: {edit.name||'neues Produkt'}</h2><p>{edit.note}</p>
      <label>Name<input className="input" required value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}/></label>
      <label>Bezugsportion inklusive Einheit<input className="input" required value={edit.serving} onChange={e=>setEdit({...edit,serving:e.target.value})}/></label>
      <div className="personal-fields">{PERSONAL_MACROS.map(k=><label key={k}>{labels[k]}<input className="input" required type="number" min="0" max={k==='kcal'?10000:1000} step="0.01" value={edit[k]} onChange={e=>setEdit({...edit,[k]:e.target.value})}/></label>)}</div>
      <label><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> Werte und Bezugsportion am Etikett geprüft. Bei unverpackten Lebensmitteln bewusst einen passenden Referenzwert verwendet.</label>
      <div className="row row--wrap"><button className="btn btn--primary" disabled={!accepted}>Werte speichern</button><button className="btn" type="button" onClick={()=>setEdit(null)}>Abbrechen</button></div>
    </form>}
    <section className="card personal-card"><h2>Mahlzeit oder Getränk planen</h2><p>Ein eigenes Frühstück/Mittagessen/Snack/Abendessen <b>ersetzt</b> den automatischen Vorschlag. Getränke und Extras zählen <b>zusätzlich</b>. Die übrigen Mahlzeiten werden nicht heimlich gekürzt. Prüfe danach die Tagesbilanz.</p>
      <div className="row row--wrap">{PERSONAL_RECIPES.map(r=><button key={r.name} className="btn btn--sm" onClick={()=>{setName(r.name);setMeal(r.meal);setRows(r.ids.map(id=>({id,amount:1})));setMsg('Alle Mengen sind Platzhalter mit 1 Bezugsportion. Bitte anpassen.');}}>{r.name}</button>)}</div>
      <form className="stack" onSubmit={plan} style={{marginTop:16}}>
        <label>Datum<input className="input" type="date" required value={date} onChange={e=>setDate(e.target.value)}/></label>
        <label>Name der Mahlzeit<input className="input" required value={name} onChange={e=>setName(e.target.value)}/></label>
        <label>Einplanen als<select aria-label="Einplanen als" className="input" value={meal} onChange={e=>setMeal(e.target.value)}>{[['breakfast','Frühstück ersetzen'],['lunch','Mittagessen ersetzen'],['snack','Snack ersetzen'],['dinner','Abendessen ersetzen'],['extra','Getränk / Extra hinzufügen']].map(([id,text])=><option key={id} value={id}>{text}</option>)}</select></label>
        {meal==='extra'&&<label>Uhrzeit<input className="input" type="time" required value={time} onChange={e=>setTime(e.target.value)}/></label>}
        {rows.map((r,i)=><div className="personal-row" key={i}><label>Produkt<select aria-label="Produkt" className="input" value={r.id} onChange={e=>setRows(rows.map((x,j)=>j===i?{...x,id:e.target.value}:x))}>{products.map(p=><option key={p.id} value={p.id}>{p.name}{p.verified?'':' (Etikett fehlt)'}</option>)}</select></label><label>Anzahl Bezugsportionen<input aria-label="Anzahl Bezugsportionen" className="input" type="number" min="0.01" max="100" step="0.01" required value={r.amount} onChange={e=>setRows(rows.map((x,j)=>j===i?{...x,amount:e.target.value}:x))}/><small>{products.find(p=>p.id===r.id)?.serving}</small></label><button type="button" className="btn" aria-label={'Zutat '+(i+1)+' entfernen'} onClick={()=>setRows(rows.filter((_,j)=>j!==i))}>×</button></div>)}
        <button type="button" className="btn" onClick={()=>setRows([...rows,{id:products[0].id,amount:1}])}>Zutat ergänzen</button>
        <button className="btn btn--primary">Für diesen Tag speichern</button>
      </form>
    </section>
    <section className="card personal-card"><h2>Paulaner darf dazugehören</h2><p>Die 24 Dosen müssen nicht weg. Bei deinen angegebenen 32 g Zucker liefert allein der Zucker 128 kcal pro Dose. Zwei Dosen pro Woche würden den Vorrat über 12 Wochen verteilen. Das ist eine freiwillige Planidee, kein Verbot für andere Tage. Entscheidend ist die vollständige Tagesbilanz.</p><p>Espresso, Hafermilch und Monkfruit getrennt erfassen. Pesto, Nüsse, Granola, Pizza und Mandelmehl-Tortillas nach tatsächlicher Portion planen. Für Hackfleisch Fettanteil prüfen; vorhandene Portionen aufbrauchen, statt zusätzlich Fleisch zu kaufen.</p></section>
    <p role="status" className="notice notice--info">{msg||'Noch nichts geändert.'}</p>
  </div>
}

