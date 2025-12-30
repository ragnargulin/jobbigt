# Jobbigt

**Är vad det är**

Och vad det är är en webbapplikation för att organisera och hålla koll på sin jobbjaktsprocess. Byggd med React, TypeScript, Firebase och Tailwind CSS.

## Deployed Site

**Live Demo:** [https://jobbigt-ba673.web.app/dashboard](https://jobbigt-ba673.web.app/dashboard)

## Teknisk Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Firebase (Firestore, Authentication)
- **State Management:** Redux Toolkit
- **Build Tool:** Vite
- **Hosting:** Firebase Hosting

## Funktioner

- Kanban-board för att visualisera jobbansökningar
- CRUD-operationer (skapa, läsa, uppdatera, radera ansökningar)
- Firebase-autentisering (Email/Password, Google, Anonym)
- Realtidsuppdateringar med Firestore
- Dark mode-stöd
- Responsiv design (desktop & mobile)
- Drag-and-drop för att flytta ansökningar mellan statusar
- Kollapserbara kolumner




### Installation

(du behöver: 
- Node.js (v18 eller senare)
- npm eller yarn
- Ett Firebase-projekt)

1. **Klona projektet:**
```bash
git clone <https://github.com/ragnargulin/jobbigt>
cd jobbigt
```

2. **Installera dependencies:**
```bash
npm install
```

3. **Konfigurera Firebase:**

Skapa en fil `.env` i projektets root med dina Firebase-credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. **Starta utvecklingsservern:**
```bash
npm run dev
```

Applikationen körs nu på `http://localhost:5173`

## Bygga för Produktion

```bash
npm run build
```

Byggda filer hamnar i `dist/`-mappen.

## Deployment

### Firebase Hosting

1. **Installera Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Logga in på Firebase:**
```bash
firebase login
```

3. **Initialisera hosting:**
```bash
firebase init hosting
```

4. **Deploya:**
```bash
npm run build
firebase deploy --only hosting
```


## Kravlista

### Godkänt (G)

- [x] **Git & GitHub:**
  - [x] Projektet använder Git med tydliga commits
  - [x] Projektet finns på GitHub
  - [x] README med instruktioner och länk till deployed site

- [x] **React & Komponenter:**
  - [x] Projektet är byggt med React
  - [x] Minst 4 komponenter (Auth, Dashboard, JobCard, JobForm, KanbanBoard)
  - [x] Komponenter använder props för datadelning

- [x] **State Management:**
  - [x] useState för lokal state
  - [x] Redux för global state (dark mode)

- [x] **Externa API/Tjänster:**
  - [x] Firebase Firestore för databas
  - [x] Firebase Authentication för användarhantering

- [x] **CRUD-funktionalitet:**
  - [x] Create: Skapa nya jobbansökningar
  - [x] Read: Visa alla ansökningar i kanban-board
  - [x] Update: Redigera befintliga ansökningar
  - [x] Delete: Ta bort ansökningar

- [x] **CSS & Styling:**
  - [x] Tailwind CSS för styling
  - [x] Responsiv design

- [x] **Deployment:**
  - [x] Projektet är deployat och tillgängligt online (Firebase Hosting)

### Väl Godkänt (VG)

- [x] **Avancerad State Management:**
  - [x] Redux Toolkit för global state
  - [x] Redux används för dark mode-funktionalitet

- [x] **TypeScript:**
  - [x] Hela projektet är skrivet i TypeScript
  - [x] Typsäkra interfaces och types
  - [x] Strikt typning genomgående

- [x] **Avancerad Funktionalitet:**
  - [x] Realtidsuppdateringar med Firestore subscriptions
  - [x] Drag-and-drop för att flytta jobb mellan statusar
  - [x] Kollapserbara kanban-kolumner
  - [x] Autentisering med flera metoder (Email, Google, Anonym)
  - [x] Profilmeny med användarinformation

- [x] **UX/UI:**
  - [x] Smooth övergångar och animationer
  - [x] Konsekvent design-språk
  - [x] Toast-notifikationer för användarfeedback
  - [x] Responsiv design för mobil och desktop

- [x] **Kodkvalitet:**
  - [x] Väl strukturerad och läsbar kod (hoppas jag)
  - [x] Separation of concerns (components, services, types)
  - [x] Återanvändbara komponenter
  - [x] Best practices för React och TypeScript