// Current public plan. No personal records are included.
export default {
  "format": "berias-plan",
  "schemaVersion": 1,
  "id": "berias-hybrid-mobility-v2",
  "name": "Hybrid mit Mobility · Wiedereinstieg und Aufbau",
  "effectiveFrom": "2026-10-26",
  "weeks": 12,
  "goals": [
    "Fettverlust mit Muskelerhalt",
    "Relative Kraft",
    "Ausdauer und zivile Hybridfitness"
  ],
  "deloadWeeks": [
    4,
    8
  ],
  "schedule": [
    {
      "day": 1,
      "key": "A",
      "name": "Kraft A",
      "type": "strength"
    },
    {
      "day": 2,
      "key": "easy",
      "name": "Locker Rad",
      "type": "cardio"
    },
    {
      "day": 3,
      "key": "B",
      "name": "Kraft B",
      "type": "strength"
    },
    {
      "day": 4,
      "key": "interval",
      "name": "Kontrollierte Intervalle",
      "type": "cardio"
    },
    {
      "day": 6,
      "key": "long",
      "name": "Lange Ausdauer",
      "type": "cardio"
    }
  ],
  "workouts": {
    "A": [
      {
        "id": "02",
        "name": "Klimmzug unterstützt",
        "sets": 3,
        "min": 3,
        "max": 5,
        "mode": "assistance",
        "basis": "assistance",
        "rest": 120,
        "side": false,
        "guide": "02",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "03",
        "name": "KH-Bankdrücken",
        "sets": 3,
        "min": 6,
        "max": 10,
        "mode": "load",
        "basis": "perHand",
        "rest": 120,
        "side": false,
        "guide": "03",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "01",
        "name": "Goblet Squat",
        "sets": 2,
        "min": 6,
        "max": 10,
        "mode": "load",
        "basis": "total",
        "rest": 120,
        "side": false,
        "guide": "01",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "04",
        "name": "Kabelrudern",
        "sets": 2,
        "min": 8,
        "max": 12,
        "mode": "load",
        "basis": "total",
        "rest": 90,
        "side": false,
        "guide": "04",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "curl",
        "name": "Bizepscurls",
        "sets": 2,
        "min": 8,
        "max": 12,
        "mode": "load",
        "basis": "perHand",
        "rest": 75,
        "side": false,
        "guide": "",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "05",
        "name": "Farmer Carry",
        "sets": 2,
        "min": 30,
        "max": 40,
        "mode": "time",
        "basis": "perHand",
        "rest": 60,
        "side": false,
        "guide": "05",
        "step": 5,
        "unit": "lb"
      }
    ],
    "B": [
      {
        "id": "06",
        "name": "KH-RDL",
        "sets": 2,
        "min": 6,
        "max": 10,
        "mode": "load",
        "basis": "perHand",
        "rest": 120,
        "side": false,
        "guide": "06",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "07",
        "name": "Split Squat",
        "sets": 2,
        "min": 8,
        "max": 12,
        "mode": "load",
        "basis": "perHand",
        "rest": 90,
        "side": true,
        "guide": "07",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "02",
        "name": "Klimmzug unterstützt",
        "sets": 3,
        "min": 4,
        "max": 6,
        "mode": "assistance",
        "basis": "assistance",
        "rest": 120,
        "side": false,
        "guide": "02",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "press",
        "name": "Schulterdrücken",
        "sets": 2,
        "min": 6,
        "max": 10,
        "mode": "load",
        "basis": "perHand",
        "rest": 90,
        "side": false,
        "guide": "",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "08",
        "name": "Liegestütz",
        "sets": 2,
        "min": 8,
        "max": 15,
        "mode": "bodyweight",
        "basis": "bodyweight",
        "rest": 90,
        "side": false,
        "guide": "08",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "triceps",
        "name": "Trizepsdrücken am Kabel",
        "sets": 2,
        "min": 10,
        "max": 15,
        "mode": "load",
        "basis": "total",
        "rest": 75,
        "side": false,
        "guide": "",
        "step": 5,
        "unit": "lb"
      },
      {
        "id": "09",
        "name": "Dead Bug",
        "sets": 1,
        "min": 6,
        "max": 8,
        "mode": "bodyweight",
        "basis": "bodyweight",
        "rest": 60,
        "side": true,
        "guide": "09",
        "step": 5,
        "unit": "lb"
      }
    ]
  },
  "easyMinutes": [
    20,
    30,
    35,
    25,
    35,
    40,
    40,
    30,
    40,
    45,
    45,
    30
  ],
  "longMinutes": [
    30,
    45,
    50,
    40,
    50,
    55,
    60,
    45,
    60,
    65,
    70,
    45
  ],
  "intervals": [
    null,
    [
      3,
      60,
      120
    ],
    [
      4,
      60,
      120
    ],
    null,
    [
      5,
      60,
      120
    ],
    [
      6,
      60,
      120
    ],
    [
      4,
      90,
      120
    ],
    null,
    [
      5,
      90,
      120
    ],
    [
      4,
      120,
      120
    ],
    [
      5,
      120,
      120
    ],
    null
  ],
  "notes": "Woche 1: Wiedereinstieg nur bei verträglicher leichter Belastung und ohne ungewöhnliche Schlappheit; erste Krafttage 1 bis 2 Sätze, 3 bis 4 Wiederholungen Reserve, keine Extras. Bis dahin 10 bis 20 Minuten leicht bewegen und Reaktion bis zum Folgetag beobachten. Nach Erholung 2 Wiederholungen Reserve, Hauptübungen ca. 120 s Pause. Nicht jede Einheit bis zum Versagen. Pro Tag höchstens 2 bis 4 Zusatzsätze. Ausgefallene Intervalle verfallen; nicht nachholen. Der Kalender gibt nur Obergrenzen vor. Bei Krankheit oder Rückschritt Umfang reduzieren. Die Ruhe am Sonntag bleibt erhalten.",
  "mobilitySchedule": [
    {
      "day": 2,
      "key": "mobility_A",
      "name": "Hüfte und aktive Beinkontrolle",
      "time": "20:30",
      "minutes": 20
    },
    {
      "day": 4,
      "key": "mobility_B",
      "name": "Oberkörper und Sprunggelenke",
      "time": "20:30",
      "minutes": 15
    },
    {
      "day": 6,
      "key": "mobility_C",
      "name": "Ganzkörper mit Hüftschwerpunkt",
      "time": "20:30",
      "minutes": 20
    }
  ],
  "mobilityWorkouts": {
    "mobility_A": [
      {
        "id": "warm",
        "name": "Locker gehen und marschieren",
        "dose": "2 Minuten",
        "cue": "Ruhig beginnen, ohne Atemnot."
      },
      {
        "id": "hip90",
        "name": "90/90-Hüftwechsel mit Handstütze",
        "dose": "6 langsame Wechsel",
        "cue": "Hände hinter dir aufstützen; Knie nur im angenehmen Bereich bewegen."
      },
      {
        "id": "hipflexor",
        "name": "Hüftbeuger im halben Kniestand",
        "dose": "2 × 30 Sekunden je Seite",
        "cue": "Hinteres Gesäß leicht anspannen; Becken nicht ins Hohlkreuz schieben."
      },
      {
        "id": "hamstring",
        "name": "Beinrückseite in Rückenlage mit Handtuch",
        "dose": "2 × 30 Sekunden je Seite",
        "cue": "Handtuch um den Fuß; Knie darf gebeugt sein. Sanfter Zug, nicht reißen."
      },
      {
        "id": "march",
        "name": "Knieheben im Stand mit Handstütze",
        "dose": "2 × 5 je Seite, jeweils 3 Sekunden halten",
        "cue": "Aufrecht stehen; Becken ruhig, ohne Schwung."
      },
      {
        "id": "straight",
        "name": "Gestrecktes Bein nach vorne anheben",
        "dose": "2 × 4 je Seite, jeweils 2 Sekunden halten",
        "cue": "An einer Stütze festhalten. Kleine Höhe genügt; ohne Rücklage. Bei Bedarf Knie etwas beugen."
      },
      {
        "id": "calf",
        "name": "Wade an der Wand dehnen",
        "dose": "1 × 30 Sekunden je Seite",
        "cue": "Hintere Ferse am Boden; nur angenehmer Zug."
      }
    ],
    "mobility_B": [
      {
        "id": "warm",
        "name": "Locker gehen",
        "dose": "1 bis 2 Minuten",
        "cue": "Angenehm beginnen."
      },
      {
        "id": "cat",
        "name": "Katze–Kuh im Vierfüßler",
        "dose": "6 ruhige Wiederholungen",
        "cue": "Rücken kontrolliert runden und strecken; keine Endposition erzwingen."
      },
      {
        "id": "openbook",
        "name": "Open Book in Seitenlage",
        "dose": "6 je Seite",
        "cue": "Knie übereinander lassen; oberen Arm und Brustkorb langsam öffnen."
      },
      {
        "id": "wall",
        "name": "Wall Slides",
        "dose": "2 × 8",
        "cue": "Arme an der Wand nach oben führen, ohne starkes Hohlkreuz."
      },
      {
        "id": "pec",
        "name": "Brustdehnung am Türrahmen",
        "dose": "2 × 20 bis 30 Sekunden je Seite",
        "cue": "Bequeme Armposition; kein Ziehen vorne im Schultergelenk."
      },
      {
        "id": "ankle",
        "name": "Knie-zur-Wand für das Sprunggelenk",
        "dose": "2 × 8 je Seite",
        "cue": "Knie vorführen; Ferse bleibt unten."
      }
    ],
    "mobility_C": [
      {
        "id": "warm",
        "name": "Locker gehen und marschieren",
        "dose": "2 Minuten",
        "cue": "Ruhig beginnen, ohne Atemnot."
      },
      {
        "id": "hip90",
        "name": "90/90-Hüftwechsel mit Handstütze",
        "dose": "6 langsame Wechsel",
        "cue": "Hände hinter dir aufstützen; Knie nur im angenehmen Bereich bewegen."
      },
      {
        "id": "hipflexor",
        "name": "Hüftbeuger im halben Kniestand",
        "dose": "1 × 30 Sekunden je Seite",
        "cue": "Hinteres Gesäß leicht anspannen; Becken nicht ins Hohlkreuz schieben."
      },
      {
        "id": "hamstring",
        "name": "Beinrückseite in Rückenlage mit Handtuch",
        "dose": "1 × 30 Sekunden je Seite",
        "cue": "Handtuch um den Fuß; Knie darf gebeugt sein. Sanfter Zug, nicht reißen."
      },
      {
        "id": "march",
        "name": "Knieheben im Stand mit Handstütze",
        "dose": "1 × 5 je Seite, jeweils 3 Sekunden halten",
        "cue": "Aufrecht stehen; Becken ruhig, ohne Schwung."
      },
      {
        "id": "straight",
        "name": "Gestrecktes Bein nach vorne anheben",
        "dose": "1 × 4 je Seite, jeweils 2 Sekunden halten",
        "cue": "An einer Stütze festhalten. Kleine Höhe genügt; ohne Rücklage. Bei Bedarf Knie etwas beugen."
      },
      {
        "id": "calf",
        "name": "Wade an der Wand dehnen",
        "dose": "1 × 30 Sekunden je Seite",
        "cue": "Hintere Ferse am Boden; nur angenehmer Zug."
      },
      {
        "id": "openbook",
        "name": "Open Book in Seitenlage",
        "dose": "6 je Seite",
        "cue": "Knie übereinander lassen; oberen Arm und Brustkorb langsam öffnen."
      },
      {
        "id": "wall",
        "name": "Wall Slides",
        "dose": "1 × 8",
        "cue": "Arme an der Wand nach oben führen, ohne starkes Hohlkreuz."
      },
      {
        "id": "focus",
        "name": "Eine schmerzfreie Schwerpunktbewegung wiederholen",
        "dose": "Optional 1 zusätzlicher Satz",
        "cue": "Nach spätestens 20 Minuten beenden. Kein Training bis zur Erschöpfung."
      }
    ]
  },
  "mobilityNotes": "Woche 1 nur ein Satz je Übung und ca. 20 Sekunden dehnen, bei Schlappheit höchstens 5 bis 10 Minuten angenehm bewegen. Ab Woche 2 bei guter Verträglichkeit voller Umfang. Ab Woche 3 beim Beinheben entweder etwas mehr Höhe oder 3 bis 5 Sekunden Halten, nicht beides gleichzeitig. Sanfter Zug ohne Schmerz. Montag/Mittwoch optional 5 Minuten locker bewegen, Freitag/Sonntag frei."
};
