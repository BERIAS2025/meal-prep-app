// Unknown labels stay empty. No guessed Costco brand data is used in totals.
const draft = (id, name, serving, note = '') => ({ id, name, serving, kcal: '', protein: '', carbs: '', fat: '', fiber: '', verified: false, note });
export const PERSONAL_PRODUCTS = [
  draft('pesto', 'Pesto', '1 Portion laut Glas', 'Marke und Gramm pro Portion vom Glas übernehmen.'),
  draft('tortillas', 'Siete Almond Flour Tortillas', '1 Tortilla', 'Nährwerte auf eine Tortilla umrechnen, falls das Etikett zwei nennt.'),
  draft('eggs', 'Eier', '1 Ei', 'Größe beachten. Bratöl separat erfassen.'),
  draft('vegetables', 'Gemüse / TK-Mischung', '100 g', 'Ohne zusätzliche Sauce oder Öl, sofern nicht auf dem Etikett enthalten.'),
  draft('tortellini', 'Tortellini', '1 Portion laut Packung', 'Gewicht und Zustand wie auf der Packung verwenden, nicht trocken und gekocht mischen.'),
  draft('pizza', 'Kirkland Signature Cauliflower Crust Pizza', '1 Portion laut Packung', 'Anteil der ganzen Pizza festhalten, zum Beispiel ¼ Pizza. Kein automatisches Diätprodukt.'),
  draft('nuts', 'Nüsse', '1 Portion laut Packung', 'Gramm abwiegen, eine Handvoll ist keine feste Menge.'),
  draft('yogurt', 'Kirkland Signature Organic Greek Yogurt', '1 Portion laut Becher', 'Fettstufe, Protein und Portionsgewicht prüfen.'),
  draft('granola', 'Kirkland Signature Organic Ancient Grain Granola', '1 Portion laut Packung', 'Normales und Low-Carb-Granola unterscheiden sich deutlich.'),
  draft('whey_chocolate', 'ON Gold Standard 100% Whey Milk Chocolate', '1 Scoop laut Dose', 'Scoop-Gewicht und Werte deines Produkts eintragen. Auch an Ruhetagen nutzbar.'),
  draft('egg_whites', 'Flüssiges Eiklar', '1 Portion laut Packung', 'Nur falls du mit Eiweiß auch flüssiges Eiklar meinst.'),
  draft('ground_beef', 'Hackfleisch aus dem Tiefkühler', '100 g roh', 'Fettanteil und rohe Packungswerte nutzen. Danach Portionen ebenfalls roh abwiegen.'),
  { ...draft('paulaner', 'Paulaner Sunset', '1 Dose', '24 Dosen gekauft. 32 g Zucker laut deiner Angabe. 128 kcal sind nur aus dem Zucker berechnet; Gesamtkalorien und weitere Kohlenhydrate am Etikett prüfen.'), kcal:128, carbs:32 },
  draft('oat_milk', 'Oatly Hafermilch für Espresso', '100 ml', 'Original, Barista und andere Oatly-Varianten unterscheiden sich. Tatsächlich verwendete Menge messen. Bei 40 ml: 0,4 Portionen.'),
  draft('espresso', 'Espresso', '1 Espresso', 'Ohne Hafermilch und Süßungsmittel erfassen.'),
  draft('monkfruit', 'Monkfruit-Süße', '1 Portion laut Packung', 'Mischungen können weitere Zutaten enthalten. Packungswerte verwenden.'),
];

export const PERSONAL_RECIPES = [
  { name:'Joghurt, Schoko-Whey und Granola', meal:'breakfast', ids:['yogurt','whey_chocolate','granola'] },
  { name:'Ei-Gemüse-Wraps', meal:'lunch', ids:['tortillas','eggs','vegetables'] },
  { name:'Tortellini mit Pesto und Gemüse', meal:'dinner', ids:['tortellini','pesto','vegetables'] },
  { name:'Pizza und Gemüse', meal:'dinner', ids:['pizza','vegetables'] },
  { name:'Hackfleisch-Gemüse-Wraps', meal:'dinner', ids:['ground_beef','tortillas','vegetables'] },
  { name:'Espresso mit Hafermilch', meal:'extra', ids:['espresso','oat_milk','monkfruit'] },
  { name:'Paulaner bewusst einplanen', meal:'extra', ids:['paulaner'] },
];
