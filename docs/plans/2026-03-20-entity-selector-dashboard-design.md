# Design: Entity Selector + Dashboard Financiali
**Data:** 2026-03-20
**Stato:** Approvato

## Obiettivo
Aggiungere il selettore multi-entità a Profitera e mostrare i grafici finanziari (Profit & Loss, Saldo Bancario) nella dashboard, alimentati da Kontabila via API proxy server-side.

## Architettura: Proxy Server-Side (Opzione B)

Profitera aggiunge endpoint `server/api/kontabila/` che chiamano Kontabila internamente su `localhost:3025`. Il browser non vede mai le credenziali Kontabila.

```
Browser → Profitera (localhost:3021) → Kontabila (localhost:3025)
```

## Componenti

### 1. Entity Selector (Header)
- Il bottone "0 aziende" diventa dropdown con le entità da Kontabila
- Entità disponibili: Smiledoc S.r.l., Horus Holding S.r.l., Dott. Piernatale Civero, Annita Di Vozzo
- Selezione salvata in Pinia store (`useEntityStore`) + localStorage per persistenza
- Quando nessuna entità selezionata: dashboard mostra stato vuoto con prompt selezione
- Quando entità selezionata: dashboard carica dati di quell'entità specifica

### 2. Dashboard (pages/dashboard/index.vue)
Quando entità selezionata, mostra 2 grafici affiancati:
- **Profit & Loss** — grafico a barre mensili, anno corrente vs anno precedente (verde/grigio)
- **Saldo Bancario** — grafico a linea, ultimi 24 mesi
Nessun altro widget (design minimal, opzione C approvata).

### 3. Server Proxy Endpoints
Tre file in `server/api/kontabila/`:
- `entities.get.ts` — restituisce lista entità da Kontabila
- `dashboard.get.ts?entityId=X` — dati mensili P&L per entità
- `bank-balance.get.ts?entityId=X` — saldo bancario mensile 24 mesi

Ogni endpoint:
1. Fa login su Kontabila con credenziali da env (`KONTABILA_URL`, `KONTABILA_EMAIL`, `KONTABILA_PASSWORD`)
2. Chiama l'API Kontabila con il token ottenuto
3. Restituisce i dati al frontend

### 4. Pinia Store (stores/entity.ts)
```ts
selectedEntityId: number | null
selectedEntityName: string | null
entities: Entity[]
```
Persistito in localStorage. Caricato al mount dell'app.

## Variabili Env da aggiungere
```env
KONTABILA_URL=http://localhost:3025
KONTABILA_EMAIL=your-email@example.com
KONTABILA_PASSWORD=...
```

## File da creare/modificare
- `server/api/kontabila/entities.get.ts` — nuovo
- `server/api/kontabila/dashboard.get.ts` — nuovo
- `server/api/kontabila/bank-balance.get.ts` — nuovo
- `stores/entity.ts` — nuovo
- `pages/dashboard/index.vue` — modifica (aggiungi grafici)
- `components/EntitySelector.vue` — nuovo (dropdown header)
- Layout header (modifica bottone "0 aziende")
- `.env` sul server — aggiungi variabili Kontabila
