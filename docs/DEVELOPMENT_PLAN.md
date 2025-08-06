# FOSS Stack Hub - Entwicklungsplan

## Aktueller Status: Frontend Prototyp

### Design-Prinzipien
- **Minimalistisch**: Fokus auf Inhalt, viel Whitespace, saubere Linien
- **Farbschema**: Monochrom (Grau/Schwarz/Weiß) + warme Akzentfarbe (#FF6B35 - Orange)
- **Typografie**: System-Fonts für Performance und Lesbarkeit  
- **Dark/Light Mode**: Automatisches Schema mit CSS custom properties
- **Responsive**: Desktop-first Ansatz

### Aktuelle Reihenfolge der Implementierung

1. ✅ **Landing Page** 
   - Hero Section mit Logo/Slogan
   - App Preview
   - 3 Key Features als Cards
   - Mini-FAQ
   - Footer

2. **Dashboard/Home**
   - Sidebar Navigation
   - Main Feed mit Stack Cards
   - Activity Graph Platzhalter
   - Leaderboard Panel

3. **Stack Page**
   - Stack Details
   - Asset Liste
   - Activity Feed
   - Comment/Chat Bereich

4. **Stack Editor**
   - Drag & Drop Interface
   - Asset Upload
   - Workflow Steps
   - Publish Button

5. **Profile Page**
   - User Info
   - Activity Graph
   - Badges/Achievements
   - User Stacks

6. **Community/Channels**
   - Channel Übersicht
   - Chat Interface

### Technische Details
- **HTML**: Semantisch korrekt, Accessibility beachten
- **CSS**: Custom Properties für Theming, Flexbox/Grid für Layout
- **Struktur**: Separate Dateien für jede Seite
- **Icons**: Saubere SVG Icons (keine Emojis)
- **Performance**: Minimal CSS, optimierte Bilder

### Farbpalette
```css
:root {
  /* Light Theme */
  --color-primary: #FF6B35;     /* Warme Akzentfarbe */
  --color-text: #2c3e50;       /* Dunkelgrau für Text */
  --color-text-light: #7f8c8d; /* Hellgrau für Sekundärtext */
  --color-bg: #ffffff;         /* Weiß Background */
  --color-bg-alt: #f8f9fa;     /* Heller Grau für Cards */
  --color-border: #e9ecef;     /* Sehr helles Grau für Borders */
}

[data-theme="dark"] {
  --color-text: #ecf0f1;
  --color-text-light: #95a5a6;
  --color-bg: #2c3e50;
  --color-bg-alt: #34495e;
  --color-border: #34495e;
}
```

### Mock-Daten Beispiele
- **Stacks**: "Procreate Mega Bundle", "Blender Workflow Kit", "FOSS Dev Toolkit"
- **Users**: "PixelMaster", "CodeCrafter", "DesignGuru"
- **Tags**: "Procreate", "Blender", "Open Source", "Productivity"

### Nächste Schritte
1. Landing Page komplett fertigstellen
2. CSS-System für alle Seiten vorbereiten
3. Komponenten-basierte Struktur für Wiederverwendbarkeit

---
*Letztes Update: $(date)*