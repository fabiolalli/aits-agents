# AITS Full Analysis

Esegui un'analisi decisionale completa con il sistema AITS (Adaptive Intelligence Thinking System).

## Cosa fa

Attiva il Meta-Orchestratore (Blu) che orchestra una sequenza completa di agenti cognitivi per analizzare il problema da ogni dimensione:

1. **Analitico (Bianco)** → Base fattuale: dati, metriche, lacune
2. **Emotivo-Intuitivo (Rosso)** → Percezioni, emozioni, resistenze degli stakeholder
3. **Creativo-Generativo (Verde)** → Alternative e opzioni non convenzionali
4. **Critico-Validatore (Nero)** → Stress test: rischi, fallacie, guardrail
5. **Ottimizzatore (Giallo)** → Business case, quick wins, leve di valore
6. **Etico-Governance (Viola)** → Fairness, compliance, red lines
7. **Predittivo-Strategico (Indaco)** → Scenari futuri, sensibilità
8. **Systemic (opzionale)** → Se il problema ha interdipendenze complesse
9. **Foresight (opzionale)** → Se le opzioni sono > 4
10. **Meta-Orchestratore (Blu)** → Sintesi integrata, decisione, piano d'azione

## Come usarlo

Descrivi il problema decisionale in modo completo, includendo:
- Il contesto di business
- Gli stakeholder coinvolti
- I vincoli (tempo, budget, risorse)
- Le opzioni già considerate (se presenti)
- I KPI rilevanti

Il Blu deciderà autonomamente se attivare tutti gli agenti o solo quelli necessari, e gestirà conflitti e iterazioni secondo le regole AITS.

## Quando usarlo

- Decisioni strategiche importanti
- Problemi con dimensioni multiple (finanziarie, umane, etiche, tecnologiche)
- Scelte irreversibili o con impatto a lungo termine
- Situazioni dove serve il massimo rigore decisionale

## Output atteso

Un JSON strutturato con:
- Sintesi integrata che unisce tutte le prospettive
- Decisione chiara e azionabile
- Piano d'azione con owner, timeline e dipendenze
- Decision log che traccia il contributo di ogni agente
- Livello di confidenza e dimensioni non coperte

## Istruzioni

Usa il sub-agente `aits-meta-orchestratore` per orchestrare l'analisi completa del problema descritto dall'utente. Il Meta-Orchestratore determinerà autonomamente la sequenza ottimale degli agenti, invocandoli come sub-task e integrando i loro output nella sintesi finale. Segui le regole di sistema AITS per la gestione di conflitti, dati mancanti e rischi alti.

