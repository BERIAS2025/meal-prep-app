# BERIAS Austauschformat v1

UTF-8 JSON, `schemaVersion: 1`. Unbekannte Versionen werden abgelehnt statt still migriert. Dateigröße im Import höchstens 20 MB. Zahlen sind JSON-Zahlen (Dezimalpunkt), Datum `YYYY-MM-DD`. Keine Kommentare/Markdown-Zäune innerhalb der Datei.

## Analyseexport

`format: "berias-analysis"`. Nicht als Backup importierbar. Enthält `range`, `exportedAt`, notwendiges `profile` und Ziele, `settings`, alle `plans`, tatsächliche `sessions` im Zeitraum, `checkins`, `weights`, `trips`, `preferences`, `reschedules`, `weekAdjustments`, geplanten `calendar` und `dataGaps`.

`sessions` enthalten ID, lokales Datum, IANA-Zeitzone, UTC-Start/Ende, Plan-ID, Plan-Snapshot, Planwoche, Status, Check-in-Snapshot, Empfehlung samt Gründen und manueller Überschreibung, Ort, Notizen und Übungen/Ausdauer.

Übungen: `id`, `name`, `variant`, `equipment`, `mode`, `basis`, `side`, `unit`, `step`, `extra`, `planned`, optional `replaces`, `status`, `reason`, `sets`. Die vergleichbare Serie ist die Kombination aus ID, Variante, Gerät, Modus, Lastbasis und Seitenmessung. Die Anzeigeeinheit ist nicht Bestandteil der Serienidentität.

Sätze: `loadKg` ist der kanonische ungerundete Lastwert, `original:{value,unit}` die ursprüngliche Eingabe, `reps` zählt Wiederholungen oder Sekunden bei `mode:"time"`, `right` die rechte Seite, `rir` die geschätzte Reserve 0–10, `clean` die bestätigte Technik. `status` ist `pending`, `done`, `skipped` oder `undocumented`. Nur `done` ist absolviert; vorausgefüllte Zahlen sind noch keine Leistung. Bei `basis:"perHand"` ist die Last je Hand angegeben; bei `assistance` bedeutet weniger Last weniger Hilfe. Körpergewicht wird nicht in eine fiktive Hantellast umgerechnet.

Ausdauer: Aktivität, Gerät/Strecke und Bedingungen separat; `duration` in Minuten, `distance` in `distanceUnit` (mi/km), `speed` in `speedUnit` (mph/km/h), optionale Puls-/Steigungswerte, `rpe`, `plannedIntervals` und tatsächliche `intervals` mit Sekundenwerten. Nur `confirmed:true` gilt als absolviert. Distanz / Dauer ergibt Durchschnittstempo; Gerätetempo kann davon abweichen.

Vergleiche nicht blind unterschiedliche Geräte, Varianten, Seiten, Unterstützung oder Ausdauerbedingungen. Beurteile Trends über mehrere Wochen und benenne Datenlücken; keine Übertrainingsdiagnose aus wenigen Einträgen.

## Vollständiges Backup

`format:"berias-backup"`, sonst vollständiger interner Datenbestand mit `revision`. Keine Zeitraumfilterung. Wiederherstellung validiert Daten und ersetzt atomar den Browserbestand. Sie hängt keine Datensätze an. Doppelte Session-/Plan-IDs, ungültige numerische Werte, unbekannte Formate und mehrere laufende Trainings werden abgewiesen. Ein Schemawechsel benötigt eine ausdrücklich implementierte Migration; derzeit nur v1.

## Planimport für andere Assistenten

Erzeuge ausschließlich den folgenden separaten Plantyp. Exportiere zunächst den bestehenden Plan aus der App oder nutze `beispiel-plan.json` als strukturelle Vorlage. Erhalte unveränderte Übungs-IDs, wenn dieselbe Bewegung gemeint ist. Neue Varianten werden in Trainings separat erfasst.

Pflichtfelder:

| Feld | Bedeutung |
|---|---|
| `format` | exakt `berias-plan` |
| `schemaVersion` | exakt 1 |
| `id` | neue eindeutige Zeichenfolge, maximal 100 Zeichen |
| `name` | lesbarer deutscher Planname |
| `effectiveFrom` | gültiges Datum heute oder später, keine bereits belegte Startgrenze |
| `weeks` | 12 (v1 unterstützt genau 12 Wochen) |
| `goals` | Array nichtleerer Texte |
| `deloadWeeks` | Array ganzer Wochenzahlen 1–12, auch leer möglich |
| `schedule` | 1–7 Einträge mit eindeutigen `day` und `key`; Sonntag=0, Montag=1 |
| `workouts` | Objekt aus Kraftschlüsseln und Übungsarrays |
| `easyMinutes`, `longMinutes` | jeweils 12 Minutenwerte, 5–240 |
| `intervals` | 12 Werte; je `null` oder `[Anzahl, Arbeitssekunden, Pausensekunden]` |

Kalendereintrag: `{ "day":1,"key":"A","name":"Kraft A","type":"strength" }`. Kraftschlüssel referenziert `workouts`. Ausdauerschlüssel sind ausschließlich `easy`, `interval`, `long`, mit `type:"cardio"`.

Übungsdefinition, Beispiel:

```json
{"id":"03","name":"KH-Bankdrücken","sets":3,"min":6,"max":10,"mode":"load","basis":"perHand","rest":120,"side":false,"guide":"03","step":5,"unit":"lb"}
```

`sets`: 1–10; `min`/`max`: 1–600; `mode`: load/assistance/bodyweight/time; `basis`: total/perHand/assistance/bodyweight; `rest`: Pause in Sekunden 0–600; `step`: verfügbare Laststufe 0,1–100 in `unit` (kg/lb); `side`: boolesch. `guide` optional, vorhandene Anleitungs-IDs 01–12. IDs innerhalb einer Einheit eindeutig. Freiwillige Extras gehören nicht automatisch in die Grundplanung.

Die App wendet auf diese Vorlage ihre dokumentierten Wochenregeln an: W1 zwei Sätze; W12 zwei Vergleichssätze; Wochenreserve und optionale Entlastung; Check-in und Reiseanpassungen. Der Import kann diese Regeln in v1 nicht mit beliebigem Programmcode überschreiben. Intervallpausen zählen nur zwischen Wiederholungen. Null ist ein lockerer Intervalltag. W1 easy und W12 interval sind die originalen Vergleichsprotokolle.

Vor Übernahme zeigt die App geänderte Bereiche und den vollständigen Vorher-/Nachher-Plan. Erst ausdrückliche Bestätigung speichert eine neue Version. Bereits begonnene und historische Trainings bleiben unverändert. Keine Trainingsdaten in eine Planimportdatei schreiben.
