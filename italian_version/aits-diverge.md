# AITS Diverge — Brainstorming Creativo

Esegui un'esplorazione divergente con il sistema AITS — per generare opzioni, rompere schemi e trovare lo spazio delle possibilità prima di convergere.

## Cosa fa

Attiva una sequenza orientata alla generazione creativa:

1. **Creativo-Generativo (Verde)** → Opzioni, analogie cross-industry, idee radicali
2. **Emotivo-Intuitivo (Rosso)** → Quale opzione genera entusiasmo? Quale resistenza?
3. **Foresight (Foresight)** → Le opzioni generate reggono su scenari diversi?
4. **Meta-Orchestratore (Blu)** → Sintesi delle opzioni più promettenti con prossimi passi

Se il Verde genera > 4 opzioni, il Foresight viene attivato automaticamente (regola AITS).

## Come usarlo

Descrivi lo spazio esplorativo:
- Cosa stiamo cercando? (nuovo prodotto, modello di business, strategia di differenziazione...)
- Quali vincoli ci sono? (budget, tecnologia, mercato...)
- Cosa abbiamo già provato o scartato?
- Quanto possiamo essere radicali?

## Quando usarlo

- Brainstorming su nuovi prodotti o servizi
- Ricerca di differenziazione competitiva
- Stallo decisionale (le opzioni note non funzionano)
- Innovation sprint e design thinking
- Quando serve "pensare fuori dalla scatola" con struttura

## Output atteso

Un JSON ricco di opzioni con:
- 5-7+ alternative (incluse almeno 1-2 radicali)
- Analogie da altri settori
- Micro-test per validare le idee più promettenti
- Mappa emotiva: quali opzioni generano energia positiva
- Matrice robustezza (se Foresight attivato)
- Le 2-3 opzioni raccomandate per approfondimento

## Istruzioni

Usa il sub-agente `aits-meta-orchestratore` in modalità diverge. Invoca prima `aits-creativo-generativo` per generare un ampio spazio di opzioni. Poi `aits-emotivo-intuitivo` per mappare la dimensione percettiva delle opzioni. Se le opzioni sono > 4, attiva `aits-foresight` per la matrice comparativa su scenari. Infine, produci una sintesi che raccoglie le opzioni più promettenti con i rispettivi micro-test di validazione. L'obiettivo NON è decidere, ma espandere lo spazio delle possibilità in modo strutturato.

