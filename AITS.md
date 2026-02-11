# AITS — Manifesto e Teoria

## Adaptive Intelligence Thinking System

**Autore**: Fabio Lalli
**Versione**: 1.0
**Origine**: Evoluzione del modello dei Sei Cappelli per Pensare (Edward de Bono, 1985)

---

## Il Problema

Le decisioni complesse soffrono di bias cognitivi sistematici: confirmation bias, groupthink, ancoraggio, effetto framing. I framework tradizionali di decision-making o sono troppo semplici (pro/contro) o troppo accademici (decision trees a 47 nodi che nessuno usa davvero).

Il modello dei Sei Cappelli di De Bono ha avuto il merito di rendere il pensiero strutturato accessibile: indossa un cappello alla volta, pensa da quella prospettiva. Ma il mondo è cambiato. Le decisioni di oggi richiedono dimensioni che De Bono non aveva previsto: etica dell'AI, scenari predittivi, pensiero sistemico, compliance normativa.

## La Soluzione: AITS

AITS prende l'intuizione fondamentale di De Bono — **separare le modalità di pensiero per poi integrarle** — e la evolve in un sistema completo:

### Da 6 cappelli a 11 agenti

| De Bono | AITS | Cosa cambia |
|---------|------|-------------|
| Bianco (Fatti) | **Analitico** | Output JSON strutturato, metriche verificabili, tracking delle lacune |
| Rosso (Emozioni) | **Emotivo-Intuitivo** | Mappe emotive per stakeholder, driver di fiducia e resistenza |
| Nero (Critica) | **Critico-Validatore** | Premortem formale, mappa rischi, detection di fallacie logiche |
| Giallo (Ottimismo) | **Ottimizzatore** | Business case strutturato, quick wins, sequenziamento del valore |
| Verde (Creatività) | **Creativo-Generativo** | Analogie cross-domain, micro-test per validazione rapida |
| Blu (Processo) | **Meta-Orchestratore** | Orchestrazione formale con regole, decision log, sintesi integrata |
| — | **Etico-Governance** | *Nuovo*: fairness, red lines, accountability, compliance AI |
| — | **Predittivo-Strategico** | *Nuovo*: simulazione scenari, analisi di sensibilità |
| — | **Systemic** | *Nuovo*: feedback loop, leve di sistema, diagrammi causali |
| — | **Foresight** | *Nuovo*: matrice opzioni-scenari, early warnings |

### Da framework mentale a sistema operativo

De Bono proponeva un esercizio mentale. AITS è un **sistema con regole formali**:

- **Output strutturati**: ogni agente produce JSON con campi definiti
- **Regole di attivazione**: trigger automatici che determinano quali agenti servono
- **Gestione conflitti**: quando due agenti confliggono, c'è un arbitro designato
- **Decision log**: ogni decisione è tracciabile e riproducibile
- **Metriche di qualità**: il sistema misura la propria efficacia

## I Principi di Design

### 1. Separazione cognitiva
Ogni agente ha una e una sola funzione. Il Critico non ottimizza. L'Ottimizzatore non critica. Questa separazione previene i bias: quando indossi tutti i cappelli insieme, il cappello dominante vince sempre.

### 2. Sequenza prima, contenuto poi
L'ordine in cui attivi gli agenti cambia il risultato. Il Meta-Orchestratore decide la sequenza ottimale in base al tipo di problema. Un'analisi che parte dai dati (Bianco → Nero → Giallo) produce output diversi da una che parte dalla creatività (Verde → Rosso → Foresight).

### 3. Conflitto produttivo
Il conflitto tra agenti non è un bug, è una feature. Quando il Nero (rischi) e il Giallo (opportunità) confliggono, emerge una tensione che l'Etico può arbitrare. Senza questa tensione, le decisioni sono o troppo prudenti o troppo ottimistiche.

### 4. Output verificabile
Ogni affermazione ha una fonte o è marcata come ipotesi. Ogni rischio ha una probabilità e un impatto. Ogni opzione ha un criterio di validazione. Niente "secondo me": dati, evidenze, struttura.

### 5. Completezza controllata
Non ogni decisione ha bisogno di 11 prospettive. AITS prevede tre modalità operative: analisi completa, decisione rapida, brainstorming divergente. Il Meta-Orchestratore calibra la profondità in base al problema.

## Implementazione in Claude Code

Questo repository implementa AITS come sistema di sub-agenti per Claude Code. Ogni agente AITS diventa un file `.md` con system prompt, tool access e output format. Il Meta-Orchestratore usa il tool `Task` per invocare gli altri agenti come sub-task, raccogliere i loro output JSON e produrre la sintesi finale.

Il risultato è un framework di decision-making che puoi invocare con un singolo comando e che produce un'analisi multi-dimensionale tracciabile, ripetibile e azionabile.

---

*"Il pensiero è l'ultima skill che ancora non abbiamo strutturato. AITS è un tentativo."*
— Fabio Lalli
