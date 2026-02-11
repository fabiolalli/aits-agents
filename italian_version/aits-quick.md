# AITS Quick Decision

Esegui un'analisi decisionale rapida con il sistema AITS — fast track per decisioni che richiedono rigore ma non il flusso completo.

## Cosa fa

Attiva una sequenza ridotta di 3 agenti + sintesi:

1. **Analitico (Bianco)** → Base fattuale essenziale
2. **Critico-Validatore (Nero)** → Rischi principali e deal-breaker
3. **Ottimizzatore (Giallo)** → Valore catturabile e quick wins
4. **Meta-Orchestratore (Blu)** → Sintesi e decisione rapida

Se il Nero segnala rischio "alto", il Blu attiverà automaticamente l'Etico o il Predittivo (regola AITS inviolabile).

## Come usarlo

Descrivi il problema in modo conciso. Il focus è su:
- Cosa devo decidere?
- Quali sono i vincoli principali?
- Entro quando serve la decisione?

## Quando usarlo

- Decisioni operative day-to-day che richiedono comunque struttura
- Go/no-go rapidi
- Valutazioni preliminari prima di un'analisi completa
- Quando il tempo è il vincolo principale

## Output atteso

Un JSON snello con:
- Fatti chiave verificati
- Top 3 rischi
- Business case sintetico
- Decisione con livello di confidenza
- Eventuali flag per analisi approfondita

## Istruzioni

Usa il sub-agente `aits-meta-orchestratore` in modalità quick. Invoca in sequenza: `aits-analitico`, poi `aits-critico-validatore`, poi `aits-ottimizzatore`. Raccogli gli output JSON e produci una sintesi rapida. Se il Critico segnala rischio alto, attiva `aits-etico-governance` o `aits-predittivo-strategico` prima della sintesi. L'obiettivo è una decisione solida nel minor tempo possibile.

