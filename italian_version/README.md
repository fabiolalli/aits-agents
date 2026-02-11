# AITS — Adaptive Intelligence Thinking System for Claude Code

Un sistema di agenti cognitivi per il decision-making strutturato, ispirato ai Sei Cappelli di Edward de Bono e ripensato da **Fabio Lalli** come framework evoluto a 11 agenti con orchestrazione, output JSON e regole di interazione.

> **AITS non è una collezione di esperti da chiamare uno alla volta.
> È un sistema di pensiero dove gli agenti si attivano in sequenza logica, si passano contesto e convergono verso una decisione tracciabile.**

---

## 📥 Installazione

### Opzione 1: Globale (disponibile in tutti i progetti)

```bash
git clone https://github.com/fabiolalli/aits-agents.git
mkdir -p ~/.claude/agents ~/.claude/commands
cp aits-agents/italian_version/meta-orchestratore.md ~/.claude/agents/
cp aits-agents/italian_version/analitico.md aits-agents/italian_version/emotivo-intuitivo.md aits-agents/italian_version/critico-validatore.md aits-agents/italian_version/ottimizzatore.md aits-agents/italian_version/creativo-generativo.md aits-agents/italian_version/etico-governance.md aits-agents/italian_version/predittivo-strategico.md ~/.claude/agents/
cp aits-agents/italian_version/systemic.md aits-agents/italian_version/foresight.md ~/.claude/agents/
cp aits-agents/italian_version/aits-full.md aits-agents/italian_version/aits-quick.md aits-agents/italian_version/aits-diverge.md ~/.claude/commands/
```

### Opzione 2: Per progetto (solo nel progetto corrente)

```bash
git clone https://github.com/fabiolalli/aits-agents.git
mkdir -p .claude/agents .claude/commands
cp aits-agents/italian_version/meta-orchestratore.md .claude/agents/
cp aits-agents/italian_version/analitico.md aits-agents/italian_version/emotivo-intuitivo.md aits-agents/italian_version/critico-validatore.md aits-agents/italian_version/ottimizzatore.md aits-agents/italian_version/creativo-generativo.md aits-agents/italian_version/etico-governance.md aits-agents/italian_version/predittivo-strategico.md .claude/agents/
cp aits-agents/italian_version/systemic.md aits-agents/italian_version/foresight.md .claude/agents/
cp aits-agents/italian_version/aits-full.md aits-agents/italian_version/aits-quick.md aits-agents/italian_version/aits-diverge.md .claude/commands/
```

Riavvia Claude Code per caricare gli agenti.

---

## 🚀 Come Usarlo

### Analisi completa di un problema

```
/aits-full

"Dovremmo lanciare il prodotto X nel mercato Y entro Q2?"
```

Il Meta-Orchestratore (Blu) attiva automaticamente gli agenti necessari, raccoglie gli output JSON, gestisce i conflitti e produce una sintesi integrata con decisione e piano d'azione.

### Decisione rapida

```
/aits-quick

"Conviene acquisire l'azienda Z?"
```

Fast track: Analitico → Critico → Ottimizzatore → Sintesi Blu. Per quando servono risposte solide in poco tempo.

### Brainstorming divergente

```
/aits-diverge

"Come possiamo differenziarci nel mercato del wellness premium?"
```

Creativo → Emotivo → Foresight → Sintesi Blu. Per esplorare spazi di opportunità prima di convergere.

### Invocazione diretta

Puoi anche chiamare un singolo agente:

```
"Fammi un'analisi critica di questo business plan"     → Critico-Validatore (Nero)
"Quali alternative creative abbiamo?"                   → Creativo-Generativo (Verde)
"Mappami i rischi etici di questa decisione"            → Etico-Governance
"Quali scenari futuri dobbiamo considerare?"            → Predittivo-Strategico
```

---

## 🧠 Gli 11 Agenti

### Orchestrazione

| Agente | Colore | Missione |
|--------|--------|----------|
| **Meta-Orchestratore** | 🔵 Blu | Governare il flusso, integrare output, produrre decisione finale |

### Core (7 agenti)

| Agente | Colore | Missione |
|--------|--------|----------|
| **Analitico** | ⚪ Bianco | Ridurre incertezza con dati e metriche verificabili |
| **Emotivo-Intuitivo** | 🔴 Rosso | Esplicitare percezioni, emozioni e resistenze |
| **Critico-Validatore** | ⚫ Nero | Stress-test di ipotesi, rischi e fallacie |
| **Ottimizzatore** | 🟡 Giallo | Massimizzare valore, opportunità, quick wins |
| **Creativo-Generativo** | 🟢 Verde | Generare alternative e innovazione laterale |
| **Etico-Governance** | 🟣 Viola | Valutare fairness, compliance, impatto sociale |
| **Predittivo-Strategico** | 🔮 Indaco | Simulare scenari futuri e sensibilità |

### Extended (opzionali, 2 agenti)

| Agente | Missione |
|--------|----------|
| **Systemic** 🌐 | Mappare feedback loop e leve di sistema |
| **Foresight** 🔭 | Valutare robustezza delle opzioni su scenari multipli |

---

## 📁 Struttura del Repository

```
aits-agents/
├── README.md                          # Documentazione (inglese)
├── AITS.md                            # Manifesto e teoria (inglese)
│
├── meta-orchestrator.md               # 🔵 Il regista del sistema
├── analytical.md                      # ⚪ Base fattuale
├── emotional-intuitive.md             # 🔴 Dimensione percettiva
├── critical-validator.md              # ⚫ Stress test
├── optimizer.md                       # 🟡 Valore e opportunità
├── creative-generative.md             # 🟢 Alternative e innovazione
├── ethical-governance.md              # 🟣 Fairness e compliance
├── predictive-strategic.md            # 🔮 Scenari futuri
├── systemic.md                        # 🌐 Sistema e feedback loop
├── foresight.md                       # 🔭 Matrice opzioni-scenari
├── aits-full.md                       # Analisi completa
├── aits-quick.md                      # Decisione rapida
├── aits-diverge.md                    # Brainstorming divergente
│
└── italian_version/                   # 🇮🇹 Versione originale italiana
    ├── README.md
    ├── AITS.md
    ├── meta-orchestratore.md
    ├── analitico.md
    ├── ...
```

---

## ⚙️ Regole di Sistema

Queste regole sono codificate nel Meta-Orchestratore e governano il flusso automaticamente:

1. **Solo il Blu chiude la decisione** — nessun altro agente può produrre una decisione finale
2. **Mancanza dati → Bianco** — se un agente segnala dati insufficienti, il flusso ritorna all'Analitico
3. **Rischio alto → Etico o Predittivo** — se il Nero segnala rischio "alto", è obbligatorio attivare l'Etico-Governance o il Predittivo-Strategico
4. **Conflitto Nero/Giallo → Etico arbitra** — quando critica e ottimismo confliggono, l'Etico decide la direzione
5. **Opzioni numerose → Foresight** — troppe alternative? Il Foresight le valuta su scenari multipli

---

## 📊 Metriche di Qualità

Il sistema AITS traccia la qualità del processo decisionale:

- **Completezza analisi**: % dimensioni coperte dagli agenti attivati
- **Coerenza inter-agente**: gli output sono logicamente coerenti tra loro
- **Iterazioni prima della convergenza**: quanti cicli servono per arrivare alla decisione
- **% output JSON validi**: gli agenti producono output nel formato atteso
- **Human override**: quante volte l'utente ha dovuto correggere il flusso
- **Robustezza su scenari**: la decisione regge sotto condizioni diverse

---

## 💡 Best Practices

1. **Parti dal contesto**: più contesto dai al problema iniziale, migliore sarà l'analisi di ogni agente
2. **Usa `/aits-full` per decisioni importanti**: il flusso completo copre tutte le dimensioni cognitive
3. **Usa `/aits-quick` per il day-to-day**: non ogni decisione ha bisogno di 11 prospettive
4. **Fidati del Blu**: il Meta-Orchestratore sa quando attivare chi — lascialo lavorare
5. **Leggi il decision log**: la tracciabilità è uno dei vantaggi principali di AITS

---

## 📖 Origini

AITS è un'evoluzione del modello dei **Sei Cappelli per Pensare** di Edward de Bono (1985). Fabio Lalli ha ripensato il framework aggiungendo agenti per l'etica, la predizione strategica, il pensiero sistemico e il foresight, e ha introdotto un'orchestrazione formale con regole di interazione, output strutturati e metriche di qualità.

Per approfondire la teoria: vedi [AITS.md](AITS.md)

---

## 🤝 Contributing

1. Fork il repository
2. Crea un branch per la tua modifica
3. Testa gli agenti con problemi decisionali reali
4. Documenta i risultati
5. Apri una Pull Request

---

## 📄 Licenza

MIT License — Usa, modifica, distribuisci. Attribuzione gradita.

**Creato da Fabio Lalli** | AITS — Adaptive Intelligence Thinking System

