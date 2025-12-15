# The Zen Workshop
### Ein neurodiversitäts-freundlicher Vokabeltrainer für Sek I

Ein fokussierter, webbasierter Vokabeltrainer für den Englischunterricht (Sekundarstufe I, Kanton Bern), spezialisiert auf Berufs- und Werkzeugwortschatz. Entwickelt mit einem starken Fokus auf **ADHS-gerechtes Design**: Maximale Ruhe, keine unnötige Gamification, reine Lernwirksamkeit.

---

## Projektziel & Philosophie

Dieses Tool wurde als Gegenentwurf zu überladenen Lern-Apps entwickelt. Das Ziel ist **"Calm Focus"**:
* **Ruhe statt Lärm:** Kein Punktesammeln, keine Ranglisten, keine blinkenden Animationen.
* **Fokus statt Ablenkung:** Auf dem Bildschirm ist immer nur *eine* Information präsent.
* **Datenschutz:** Es werden keinerlei Daten an Server gesendet. Der Lernfortschritt wird lokal im Browser des Schülers gespeichert (`localStorage`).

### Design für Neurodiversität (ADHS & Dyslexie)
Das UI/UX-Design folgt wissenschaftlichen Erkenntnissen zur Reizverarbeitung:
* **Schriftart:** Einsatz von [Lexend](https://www.lexend.com/), einer Schriftart, die nachweislich den Lesefluss verbessert und visuellen Stress reduziert.
* **Farbpalette:** "Low Contrast Glare" (Creme-Hintergrund, Salbei-Grün, Mattes Indigo) vermeidet Blendung und beruhigt.
* **Feedback:** Haptisches Button-Design und sanfte Farben statt aggressivem Rot bei Fehlern.

---

## Features

* **Spaced Repetition:** Implementiert einen vereinfachten SM-2 Algorithmus (ähnlich Anki), der Vokabeln basierend auf dem Wissensstand zur Wiederholung vorlegt.
* **Deck-System:**
    * *Level 1:* Konkret (Werkzeuge, Berufe, Handlungen).
    * *Level 2:* Abstrakt (Konzepte, Meta-Begriffe).
    * *Space:* Thematischer Wortschatz (Unit 2).
* **Text-to-Speech (TTS):** Liest englische Wörter und Beispielsätze offline via Web Speech API vor.
* **Offline First:** Funktioniert nach dem Laden ohne Internetverbindung.
* **Responsive:** Optimiert für Desktop, Tablet und Mobile.

---

## Technische Struktur

Das Projekt basiert auf reinem **Vanilla Web Standards** (HTML5, CSS3, ES6 JavaScript).

```text
/
├── index.html        # Struktur & Layout
├── styles/
│   └── main.css      # Design ("The Zen Workshop" Theme)
├── scripts/
│   └── main.js       # Logik (Algo, TTS, Storage)
└── data/             # Vokabel-Content
    ├── level1.json
    ├── level2.json
    └── default.json
