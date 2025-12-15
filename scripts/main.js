/* Zen Workshop - Main Logic 
  Kein Server, LocalStorage, TTS, Offline-fähig
*/

// Status
let currentDeckData = [];
let currentCard = null;
let currentDeckId = 'level1';

// DOM Elemente
const els = {
    deckSelector: document.getElementById('deckSelector'),
    progressText: document.getElementById('progressText'),
    wordGerman: document.getElementById('wordGerman'),
    wordEnglish: document.getElementById('wordEnglish'),
    exampleSentence: document.getElementById('exampleSentence'),
    englishArea: document.getElementById('englishArea'),
    revealBtn: document.getElementById('revealBtn'),
    ratingArea: document.getElementById('ratingArea'),
    ratingBtns: document.querySelectorAll('.rate-btn'),
    audioBtn: document.getElementById('audioBtn')
};

// --- 1. Initialisierung ---

window.addEventListener('DOMContentLoaded', () => {
    loadDeck(els.deckSelector.value);
    
    // Event Listeners
    els.deckSelector.addEventListener('change', (e) => loadDeck(e.target.value));
    els.revealBtn.addEventListener('click', revealCard);
    els.audioBtn.addEventListener('click', speakEnglish);
    
    els.ratingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rating = parseInt(e.target.dataset.rating);
            rateCard(rating);
        });
    });
});

// --- 2. Daten & Laden ---

async function loadDeck(deckId) {
    currentDeckId = deckId;
    
    // UI Reset
    resetCardView();
    els.wordGerman.innerText = "Lade...";
    
    try {
        // WICHTIG: Wenn du das lokal ohne Webserver öffnest (file://), 
        // kann der Browser das Laden von JSON blockieren.
        // Lösung für Schul-PCs: Firefox nutzen oder einfachen Webserver.
        const response = await fetch(`data/${deckId}.json`);
        const data = await response.json();
        
        // Lernstand aus LocalStorage holen und mergen
        currentDeckData = mergeProgress(deckId, data);
        
        showNextCard();
    } catch (error) {
        console.error("Fehler beim Laden:", error);
        els.wordGerman.innerText = "Fehler beim Laden (CORS/Pfad?)";
    }
}

function mergeProgress(deckId, rawData) {
    const saved = JSON.parse(localStorage.getItem(`vocab_${deckId}`)) || {};
    
    return rawData.map(item => {
        // Standard SM-2 Werte, falls noch nie gelernt
        const progress = saved[item.id] || { 
            repetitions: 0, 
            interval: 0, 
            easeFactor: 2.5, 
            nextReview: 0 // Timestamp
        };
        return { ...item, ...progress };
    });
}

// --- 3. Karten-Logik (Spaced Repetition) ---

function getDueCards() {
    const now = Date.now();
    // Sortieren: Erst überfällige, dann neue
    return currentDeckData.filter(card => card.nextReview <= now)
                          .sort((a, b) => a.nextReview - b.nextReview);
}

function showNextCard() {
    const due = getDueCards();
    
    // Update Stats
    const total = currentDeckData.length;
    const learned = currentDeckData.filter(c => c.repetitions > 0).length;
    els.progressText.innerText = `${learned} / ${total}`;

    if (due.length === 0) {
        // Keine Karten fällig -> "Fertig für heute" Screen
        renderDoneScreen();
        return;
    }

    currentCard = due[0];
    renderCard(currentCard);
}

function renderCard(card) {
    resetCardView();
    els.wordGerman.innerText = card.de; // JSON Key: de
    els.wordEnglish.innerText = card.en; // JSON Key: en
    els.exampleSentence.innerText = card.example; // JSON Key: example
}

function renderDoneScreen() {
    els.wordGerman.innerText = "🎉";
    els.englishArea.classList.remove('hidden');
    els.wordEnglish.innerText = "Alles erledigt!";
    els.exampleSentence.innerText = "Komm später wieder.";
    els.revealBtn.classList.add('hidden');
    els.ratingArea.classList.add('hidden');
    els.audioBtn.classList.add('hidden');
}

function resetCardView() {
    els.englishArea.classList.add('hidden');
    els.ratingArea.classList.add('hidden');
    els.revealBtn.classList.remove('hidden');
    els.revealBtn.focus();
}

function revealCard() {
    els.englishArea.classList.remove('hidden');
    els.revealBtn.classList.add('hidden');
    els.ratingArea.classList.remove('hidden');
    speakEnglish(); // Auto-Play Audio (optional, gut für ADHS flow)
}

// --- 4. Algorithmus & Speichern ---

function rateCard(rating) {
    // SuperMemo-2 Algorithmus (Vereinfacht)
    // Rating: 1 (vergessen) bis 5 (perfekt)
    
    let { repetitions, interval, easeFactor } = currentCard;

    if (rating < 3) {
        repetitions = 0;
        interval = 1; // Morgen wiederholen
    } else {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.ceil(interval * easeFactor);
        }
        repetitions++;
        easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;
    }

    // Update Karte
    currentCard.repetitions = repetitions;
    currentCard.interval = interval;
    currentCard.easeFactor = easeFactor;
    // Nächstes Review in X Tagen (in Millisekunden umrechnen)
    currentCard.nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);

    // Speichern
    saveProgress();
    
    // Nächste Karte
    showNextCard();
}

function saveProgress() {
    // Wir speichern nur die Meta-Daten, nicht den ganzen Content (effizienter)
    const progressMap = {};
    currentDeckData.forEach(c => {
        progressMap[c.id] = {
            repetitions: c.repetitions,
            interval: c.interval,
            easeFactor: c.easeFactor,
            nextReview: c.nextReview
        };
    });
    localStorage.setItem(`vocab_${currentDeckId}`, JSON.stringify(progressMap));
}

// --- 5. Text-to-Speech ---

function speakEnglish() {
    if ('speechSynthesis' in window) {
        const text = els.wordEnglish.innerText; // Nur Wort lesen
        // const text = `${els.wordEnglish.innerText}. ${els.exampleSentence.innerText}`; // Wort + Satz
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB';
        window.speechSynthesis.speak(utterance);
    }
}