import { EMPTY_MACROS } from '../data/ingredients.js';
export const PERSONAL_MACROS = ['kcal','protein','carbs','fat','fiber'];
export function validProduct(p) {
  return !!p && !!p.name?.trim() && !!p.serving?.trim() && PERSONAL_MACROS.every(k => p[k] !== '' && Number.isFinite(Number(p[k])) && Number(p[k]) >= 0 && Number(p[k]) <= (k === 'kcal' ? 10000 : 1000));
}
export function mealFromProducts(products, rows, name) {
  if (!name.trim() || !rows.length) throw new Error('Name und mindestens ein Lebensmittel eintragen.');
  const items = rows.map(row => {
    const p=products.find(x=>x.id===row.id), n=Number(row.amount);
    if (!p?.verified || !validProduct(p)) throw new Error('Zuerst die Etikettwerte aller verwendeten Produkte speichern.');
    if (!Number.isFinite(n) || n<=0 || n>100) throw new Error('Portionen müssen größer als 0 und höchstens 100 sein.');
    return { productId:p.id, name:p.name, serving:p.serving, amount:n, macros:Object.fromEntries(PERSONAL_MACROS.map(k=>[k,Number(p[k])*n])) };
  });
  return {title:name.trim(), items, actual:items.reduce((a,i)=>Object.fromEntries(PERSONAL_MACROS.map(k=>[k,a[k]+i.macros[k]])),{...EMPTY_MACROS})};
}
export function customMeal(saved, key, time, done, target) {
  return {key,title:saved.title,label:key.startsWith('extra_')?'Getränk / Extra':'Eigene Mahlzeit',time,
    minutes:Number(time.split(':')[0])*60+Number(time.split(':')[1]),slots:[],customItems:saved.items,
    actual:saved.actual,target:target||saved.actual,done:!!done, sauce:null,replaced:[],isLow:false,
    why:'Feste Portionen aus deinen gespeicherten Etikettwerten.',detail:'Die Werte wurden beim Planen gespeichert. Spätere Produktänderungen verändern diesen Eintrag nicht. Zum Aktualisieren neu planen.',hasSwap:false};
}
export function personalDemand(days, portions=1) {
  const map=new Map();
  for(const day of days)for(const meal of day.meals)for(const item of meal.customItems||[]){
    const key=item.productId+'|'+item.serving;
    const prev=map.get(key)||{name:item.name,serving:item.serving,amount:0};
    prev.amount+=item.amount*portions;map.set(key,prev);
  }
  return [...map.values()];
}
