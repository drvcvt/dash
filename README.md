# FOSS Stack Hub 🚀

Eine moderne, modulare Web-Anwendung für das Verwalten und Teilen von Produktivitäts-Stacks. Entwickelt für Kreative und Entwickler mit Fokus auf Open Source Tools und Community-driven Content.

## ✨ Key Features

- **🎨 Echte SVG-Icons** - Keine Emojis mehr! Professionelle, konsistente Icons
- **📱 Responsive Design** - Funktioniert perfekt auf allen Geräten  
- **⚡ Performance-optimiert** - 60+ FPS Animationen, schnelle Ladezeiten
- **🌙 Theme-System** - Auto Dark/Light Mode + manueller Toggle
- **🔧 Modulare Architektur** - Saubere, wartbare Code-Struktur
- **🎭 Glassmorphism UI** - Moderne, ansprechende Benutzeroberfläche

## 🛠️ Technologie-Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties, Glassmorphism
- **Icons**: Selbstgehostete SVG-Icon-Bibliothek
- **Architektur**: Modulare Single-Page-Application
- **Performance**: Optimierte Animationen, Lazy Loading

## 📁 Projektstruktur (Bereinigt v2.1)

```
dash/
├── index.html                 # Haupt-Router und App-Loader
├── README.md                  # Diese Datei
│
├── shared/                    # Geteilte Ressourcen
│   ├── assets/
│   │   ├── icons/            # SVG-Icon-Bibliothek
│   │   │   └── icons.js      # Icon-Definitionen
│   │   ├── fonts/            # Web-Fonts
│   │   └── images/           # Grafiken
│   ├── css/                  # Globale Stylesheets
│   │   ├── main.css         # Haupt-CSS (importiert alle)
│   │   ├── variables.css    # CSS Custom Properties
│   │   ├── base.css         # Reset & Base-Styles
│   │   ├── layout.css       # Layout-System
│   │   ├── components.css   # UI-Komponenten
│   │   └── themes.css       # Theme-System
│   └── js/                  # Globale JavaScript-Module
│       ├── navigation.js    # Router & Navigation
│       ├── theme.js         # Theme-Management
│       └── icon-helper.js   # Icon-System
│
├── modules/                  # Feature-Module (Alle implementiert)
│   ├── landing/             # Landing Page ✅
│   │   ├── index.html      # Landing Page HTML
│   │   ├── css/
│   │   │   └── landing.css # Landing-spezifische Styles
│   │   └── js/
│   │       └── landing.js  # Landing-spezifische Logik
│   ├── dashboard/           # Dashboard ✅
│   │   └── dashboard.html  # Dashboard HTML
│   ├── stack-editor/        # Stack Editor ✅
│   │   └── stack_editor.html # Editor HTML
│   ├── stack-viewer/        # Stack Viewer ✅
│   │   └── stack-viewer.html # Viewer HTML
│   ├── leaderboard/         # Leaderboard ✅ (Neu hinzugefügt)
│   │   └── leaderboard.html # Leaderboard HTML
│   └── profile/             # User Profile ✅ (Neu hinzugefügt)
│       └── profile.html    # Profile HTML
│
├── tests/                   # Test-Suite
│   ├── modules/            # Modul-Tests
│   └── shared/             # Shared-Component-Tests
│
└── docs/                    # Umfassende Dokumentation
    ├── PROJECT_STRUCTURE.md
    ├── DEVELOPMENT_PLAN.md
    ├── MODULE_ARCHITECTURE.md
    └── ...weitere Docs
```

## ✅ Was wurde aufgeräumt (v2.1 Update)

### Entfernte Duplikate
- **❌ `src/` Verzeichnis entfernt** - War eine veraltete, monolithische Struktur
- **✅ Konsistente `shared/` Struktur** - Alle Module verwenden jetzt einheitlich die modulare CSS/JS-Architektur
- **✅ Vollständige Module** - Leaderboard und Profile-Module hinzugefügt
- **✅ Bereinigte Verweise** - Alle HTML-Dateien verweisen auf die korrekte `shared/` Struktur

### Verbesserte Architektur
- **Modulare CSS-Struktur**: `variables.css` → `base.css` → `themes.css` → `components.css` → `layout.css`
- **Konsistente Icon-Integration**: Alle Module verwenden das gleiche SVG-Icon-System
- **Einheitliche Navigation**: Alle Module nutzen das gleiche Theme- und Navigation-System

## 🚀 Schnellstart

### 1. Klonen und Starten
```bash
git clone [repository-url]
cd dash
# Öffne index.html in deinem Browser oder starte einen lokalen Server
python -m http.server 8000  # oder
npx serve .
```

### 2. Entwicklung
```bash
# Lokaler Development Server
npx live-server .
# oder
python -m http.server 8000 && open http://localhost:8000
```

### 3. Browser-Unterstützung
- **Empfohlen**: Chrome 90+, Firefox 88+, Safari 14+
- **Erforderlich**: CSS Grid, Custom Properties, ES6+ Support
- **Optional**: Backdrop-Filter für Glassmorphism-Effekte

## 🎨 Icon-System

### Verwendung in HTML
```html
<!-- Rating Icon -->
<svg class="icon icon-stat" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>

<!-- Download Icon -->  
<svg class="icon icon-stat" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
</svg>
```

### Verwendung in JavaScript
```javascript
import { createIcon, replaceEmojisWithIcons } from './shared/js/icon-helper.js';

// Einzelnes Icon erstellen
const starIcon = createIcon('star', 'icon icon-stat', 14);

// Emojis automatisch ersetzen
const htmlWithIcons = replaceEmojisWithIcons(someHtmlString);
```

### Verfügbare Icons
- **Stats**: `star`, `thumbsUp`, `download`, `storage`
- **Categories**: `design`, `development`, `audio`, `video`
- **Actions**: `heart`, `fire`, `rocket`, `trending`
- **Social**: `users`, `trophy`, `diamond`, `lightning`

## 🎯 Module Übersicht

### Landing Page (`/`)
- Hero-Section mit Projekt-Übersicht
- Feature-Highlights
- Community-Stats
- Call-to-Action für Registrierung

### Dashboard (`/dashboard`)
- Persönliche Aktivitäts-Heatmap (GitHub-Style)
- Stack-Feed mit neuesten Community-Beiträgen
- Performance-Stats und Achievements
- Mini-Leaderboard

### Stack Editor (`/editor`)
- Drag & Drop Interface für Stack-Erstellung
- Asset-Bibliothek mit Kategorisierung
- Workflow-Designer
- Real-time Preview & Publishing

### Stack Viewer (`/stack`)
- Detailansicht für einzelne Stacks
- Download- und Installation-Guides
- Community-Bewertungen
- Related Stacks

### Leaderboard (`/leaderboard`) ✨ Neu
- Top Contributors Ranking
- Beliebteste Stacks
- Community-Statistiken
- Achievement-System

### Profile (`/profile`) ✨ Neu
- Benutzer-Dashboard
- Stack-Verwaltung
- Aktivitäts-Timeline
- Erfolge und Badges

## 🎨 Design System

### Farbschema
```css
:root {
  /* Primary Colors */
  --color-primary: #007acc;
  --color-secondary: #059669;
  --color-accent: #db2777;
  
  /* Backgrounds */
  --bg-primary: #0a0f24;
  --bg-secondary: #1a1f3a;
  --bg-tertiary: #2a2f4a;
  
  /* Text */
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}
```

### Icon-Klassen
- `.icon` - Base Icon-Styling
- `.icon-stat` - Für Statistik-Icons (Star, Download, etc.)
- `.icon-category` - Für Kategorie-Icons (Design, Dev, etc.)
- `.icon-action` - Für Action-Icons mit Hover-Effekten

### Komponenten
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- **Cards**: `.card`, `.stack-card`, `.category-card`
- **Stats**: `.stat`, `.stat-item`, `.stats-grid`
- **Navigation**: `.nav-item`, `.nav-menu`, `.nav-actions`

## 🔧 Entwicklung

### Neue Icons hinzufügen
1. SVG in `shared/assets/icons/icons.js` definieren
2. Icon in `shared/js/icon-helper.js` registrieren  
3. CSS-Klassen in `shared/css/components.css` anpassen

### Neues Modul erstellen
1. Verzeichnis in `modules/` erstellen
2. HTML-Datei mit Standard-Struktur
3. Optional: CSS/JS Unterverzeichnisse
4. Route in `index.html` Router registrieren

### Code-Standards
- ✅ **Keine Emojis** - Nur echte SVG-Icons verwenden
- ✅ Semantisches HTML mit ARIA-Labels
- ✅ CSS Custom Properties für Themes
- ✅ ES6+ JavaScript mit Modulen
- ✅ Performance-optimierte Animationen (60+ FPS)
- ✅ Mobile-First Responsive Design

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Tablets */
--breakpoint-md: 768px;   /* Small Laptops */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large Screens */
```

### Grid-System
- CSS Grid für Layout-Container
- Flexbox für Komponenten-Alignment
- Responsive Spalten: `.grid-1`, `.grid-2`, `.grid-3`

## ⚡ Performance

### Optimierungen
- **CSS**: GPU-beschleunigte Animationen mit `transform` und `opacity`
- **Icons**: Inline-SVG für bessere Performance als Icon-Fonts
- **JavaScript**: ES6-Module für Tree-Shaking
- **Images**: WebP-Format mit Fallbacks
- **Fonts**: Preload von kritischen Web-Fonts

### Metriken
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Animation Frame Rate**: 60+ FPS

## 🚀 Deployment

### Statisches Hosting
```bash
# Build nicht erforderlich - direkt deploybar
# Empfohlene Plattformen:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
```

### Server-Konfiguration
```nginx
# Nginx Beispiel für SPA-Routing
location / {
    try_files $uri $uri/ /index.html;
}

# Cache-Headers für Assets
location /shared/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🧪 Testing & Validation

### Funktionstest
1. Navigiere zu `http://localhost:8000`
2. Teste alle Module über die Navigation
3. Prüfe Theme-Switching (Hell/Dunkel)
4. Validiere SVG-Icon-Darstellung
5. Teste Responsive Design

### Performance-Test
- **CSS-Animationen**: 60+ FPS bei Hover-Effekten
- **Ladezeiten**: < 2s für alle Module
- **Memory Usage**: Stabil ohne Speicher-Leaks
- **Bundle Size**: Minimal durch modulare Architektur

## 🤝 Beitragen

### Development Workflow
1. Fork das Repository
2. Feature-Branch erstellen: `git checkout -b feature/amazing-feature`
3. Commits mit aussagekräftigen Messages
4. Pull Request mit Beschreibung der Änderungen
5. Code Review & Testing

### Code-Qualität
- ESLint für JavaScript
- Stylelint für CSS
- Prettier für Code-Formatierung
- Performance-Tests für Animationen

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🙋‍♂️ Support

- **Dokumentation**: [docs/](docs/) Verzeichnis
- **Issues**: GitHub Issues für Bugs und Feature-Requests
- **Discussions**: GitHub Discussions für Fragen
- **Wiki**: Erweiterte Guides und Tutorials

---

**Made with ❤️ by the FOSS Stack Hub Community**

*Building the future of open-source productivity tools - one stack at a time.*

## 🎉 Version 2.1 - "Cleanup & Complete"

### Änderungen in dieser Version:
- ✅ **Veraltete `src/` Struktur entfernt**
- ✅ **Konsistente `shared/` Architektur**
- ✅ **Vollständige Module** (Leaderboard, Profile hinzugefügt)
- ✅ **Bereinigte Dateiverweise**
- ✅ **Performance-optimiert**
- ✅ **Enterprise-ready Code-Qualität** 