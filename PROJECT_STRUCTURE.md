# FOSS Stack Hub - Projektstruktur

## Übersicht
Dieses Projekt ist eine modulare Web-Anwendung für das Verwalten und Teilen von Produktivitäts-Stacks. Die Architektur folgt einem modularen Ansatz mit shared Components und separaten Feature-Modulen.

## Verzeichnisstruktur

```
dash/
├── index.html                    # Haupt-Router und Loader
├── README.md                     # Projekt-Dokumentation
├── 
├── shared/                       # Geteilte Ressourcen
│   ├── assets/
│   │   ├── fonts/               # Web-Fonts
│   │   ├── icons/               # Icon-Bibliothek
│   │   │   └── icons.js         # SVG-Icon-Definitionen
│   │   └── images/              # Bilder und Grafiken
│   ├── css/                     # Globale Styles
│   │   ├── main.css            # Haupt-Stylesheet (importiert alle anderen)
│   │   ├── variables.css       # CSS Custom Properties
│   │   ├── base.css            # Reset und Base-Styles  
│   │   ├── layout.css          # Layout-System
│   │   ├── components.css      # UI-Komponenten
│   │   └── themes.css          # Theme-System
│   └── js/                     # Globale JavaScript-Module
│       ├── navigation.js       # Router und Navigation
│       ├── theme.js           # Theme-Switching
│       └── icon-helper.js     # Icon-System-Helper
│
├── modules/                    # Feature-Module
│   ├── landing/               # Landing Page
│   │   ├── index.html        # Landing Page HTML
│   │   ├── css/
│   │   │   └── landing.css   # Landing-spezifische Styles
│   │   └── js/
│   │       └── landing.js    # Landing-spezifische Logik
│   │
│   ├── dashboard/            # Dashboard-Modul
│   │   └── dashboard.html    # Dashboard HTML
│   │
│   ├── stack-editor/         # Stack Editor
│   │   └── stack_editor.html # Editor HTML
│   │
│   ├── stack-viewer/         # Stack Viewer
│   ├── leaderboard/          # Leaderboard-Modul  
│   └── profile/              # Profil-Modul
│
├── src/                      # Legacy/Alternative CSS & JS
│   ├── css/
│   │   ├── styles.css        # Alternative Styles
│   │   ├── stack-editor.css  # Editor-spezifische Styles
│   │   └── _layout.css       # Layout-Alternativen
│   └── js/
│       ├── main.js          # Haupt-JavaScript
│       ├── dashboard.js     # Dashboard-Logik
│       ├── stack-editor.js  # Editor-Logik
│       └── theme.js         # Theme-Handling
│
├── tests/                   # Test-Struktur
│   ├── modules/            # Modul-Tests
│   └── shared/             # Shared-Component-Tests
│
└── docs/                    # Dokumentation (nur .md Dateien)
    ├── DEVELOPMENT_PLAN.md
    ├── MODULE_ARCHITECTURE.md
    ├── WIREFRAME.md
    ├── GLASSMORPHISM_IMPLEMENTATION.md
    ├── BACKGROUND_PATTERNS_IMPLEMENTATION.md
    ├── DASHBOARD_ENHANCEMENTS.md
    ├── DASHBOARD_TESTING.md
    ├── PERFORMANCE_OPTIMIZATIONS.md
    ├── QUICK_ACTIONS_DOCUMENTATION.md
    ├── QUICK_ACTIONS_IMPLEMENTATION.md
    └── QUICK_ACTIONS_TESTING.md
```

## Architektur-Prinzipien

### 1. Modulare Struktur
- Jedes Feature ist ein separates Modul
- Module sind weitgehend unabhängig
- Shared Components für Wiederverwendbarkeit

### 2. Icon-System
- **Keine Emojis mehr** - Alle durch echte SVG-Icons ersetzt
- Zentrale Icon-Bibliothek in `shared/assets/icons/`
- JavaScript-Helper für dynamische Icon-Erstellung
- Konsistente Styling-Klassen (`.icon`, `.icon-stat`, `.icon-category`)

### 3. CSS-Architektur
- CSS Custom Properties für Themes
- Component-basierte Styling-Struktur
- Responsive Design mit CSS Grid/Flexbox
- Moderne CSS-Features (CSS Glassmorphism, Backdrop-Filter)

### 4. Routing-System
- Zentraler Router in `index.html`
- Modulare Routen: `/dashboard`, `/editor`, `/stack`, etc.
- Unterstützung für URL-Parameter und Hash-Navigation

## Key Features

### Icon-System
```javascript
// Verwendung der Icon-Bibliothek
import { createIcon, replaceEmojisWithIcons } from './shared/js/icon-helper.js';

// Icon erstellen
const starIcon = createIcon('star', 'icon icon-stat', 14);

// Emojis automatisch ersetzen
const htmlWithIcons = replaceEmojisWithIcons(htmlWithEmojis);
```

### Theme-System
- Auto-Detection von System-Theme
- Manueller Theme-Toggle
- CSS Custom Properties für einfache Anpassung

### Performance-Optimierungen
- CSS mit optimierten Animationen (60+ FPS)
- SVG-Icons für kleinere Bundle-Größe
- Lazy Loading für Module
- Effiziente CSS-Grid-Layouts

## Entwicklung

### Neue Icons hinzufügen
1. SVG-Definition in `shared/assets/icons/icons.js` hinzufügen
2. Icon in `shared/js/icon-helper.js` registrieren
3. CSS-Klassen in `shared/css/components.css` definieren

### Neues Modul erstellen
1. Ordner in `modules/` erstellen
2. HTML-Datei mit entsprechender Struktur
3. Optional: CSS und JS Unterordner
4. Route in `index.html` Router registrieren

### Testing
- Unit-Tests in `tests/`
- Visual Regression Tests für UI-Komponenten
- Performance-Tests für Animationen

## Browser-Kompatibilität
- Modern Browsers (Chrome 90+, Firefox 88+, Safari 14+)
- CSS Grid, Flexbox, Custom Properties erforderlich
- Backdrop-Filter für Glassmorphism-Effekte
- ES6+ JavaScript Features

## Deployment
- Statische HTML/CSS/JS - kann auf jedem Webserver gehostet werden
- Keine Build-Pipeline erforderlich
- CDN-freundlich für Assets
- Progressive Web App (PWA) ready

## Code-Qualität
- ✅ Keine Emojis - Nur echte SVG-Icons
- ✅ Semantisches HTML
- ✅ Accessible Design (ARIA Labels, Screen Reader Support)
- ✅ Performance-optimierte CSS-Animationen
- ✅ Modulare, wartbare Code-Struktur
- ✅ Konsistente Naming-Conventions 