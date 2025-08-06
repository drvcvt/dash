# Quick Actions Feature - Dokumentation

## Übersicht

Das Quick Actions Feature fügt schwebende Action-Buttons zu Stack-Karten hinzu, die beim Hover erscheinen. Diese moderne, CSS-basierte Implementierung bietet einen eleganten Weg für Benutzer, schnell mit Stacks zu interagieren.

## Features

### Desktop-Experience
- **4 Quick Action Buttons**: Kopieren, Teilen, Bewerten (Star), Zu Favoriten
- **Smooth CSS-Animationen**: 250ms cubic-bezier Transitions
- **Runde Circle-Buttons**: 36px Durchmesser mit Backdrop-Filter
- **Hover-Effekte**: Individuelle Farben pro Action-Typ
- **Enhanced Card Hover**: Verstärkte Glow- und Shadow-Effekte

### Mobile-Experience
- **Three-Dots Button**: Ersetzt Desktop Quick Actions auf Mobile
- **Responsive Design**: Automatisches Umschalten bei <768px
- **Touch-optimiert**: Größere Touch-Targets

### Animationen
- **Erscheinen**: `translateY(-8px) scale(0.9)` → `translateY(0) scale(1)`
- **Button Hover**: `scale(1.1) translateY(-2px)` mit farbigen Shadows
- **Action Feedback**: Kurze Scale-Animation bei Klick
- **Toast Notifications**: Sliding-In von rechts

## Implementation Details

### CSS-Struktur
```css
.stack-quick-actions {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  opacity: 0;
  transform: translateY(-8px) scale(0.9);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.stack-card-compact:hover .stack-quick-actions {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}
```

### JavaScript-Handler
- **Event Delegation**: Effiziente Event-Behandlung
- **Action Types**: copy, share, star, favorite
- **API Integration**: Web Share API, Clipboard API
- **Visual Feedback**: Toast-Nachrichten und Button-Animationen

## Action-Typen

### Kopieren (Copy)
- **Icon**: Clipboard-Symbol
- **Farbe**: Grün (#059669)
- **Funktion**: Kopiert Stack-Link in Zwischenablage
- **API**: Clipboard API mit Fallback

### Teilen (Share)
- **Icon**: Share-Symbol
- **Farbe**: Blau (#2563eb)
- **Funktion**: Öffnet native Share-Funktionalität
- **API**: Web Share API mit Fallback

### Bewerten (Star)
- **Icon**: Stern-Symbol
- **Farbe**: Amber (#f59e0b)
- **Funktion**: Toggle Star-Status
- **State**: Visueller Fill-Status

### Favoriten (Favorite)
- **Icon**: Herz-Symbol
- **Farbe**: Rot (#dc2626)
- **Funktion**: Toggle Favoriten-Status
- **State**: Visueller Fill-Status

## Performance-Optimierungen

### CSS-Only Animationen
- Alle Hover-Effekte sind CSS-basiert
- Keine JavaScript-Animationen
- GPU-beschleunigt mit `transform` und `opacity`

### Event Delegation
- Single Event Listener für alle Buttons
- Verhindert Memory Leaks
- Bessere Performance bei vielen Karten

### Selective Animation Enable
```css
/* Nur Quick Actions-Animationen erlaubt */
.stack-quick-actions,
.quick-action-btn {
  animation-duration: unset !important;
  transition-duration: unset !important;
}
```

## Browser-Kompatibilität

### Modern Features
- **Backdrop Filter**: Für glasmorphe Effekte
- **CSS Custom Properties**: Für konsistente Farben
- **Web APIs**: Clipboard, Share (mit Fallbacks)

### Fallbacks
- Clipboard API → Console Log
- Web Share API → Console Log
- Backdrop Filter → Solid Background

## Responsive Breakpoints

### Desktop (≥768px)
- Quick Actions sichtbar
- 4 Action-Buttons
- Hover-basierte Interaktion

### Mobile (<768px)
- Quick Actions ausgeblendet
- Three-Dots Button sichtbar
- Touch-basierte Interaktion

## Customization

### Farben anpassen
```css
.quick-action-btn[data-action="copy"]:hover {
  color: #your-color;
  border-color: rgba(your-color, 0.4);
}
```

### Timing anpassen
```css
.stack-quick-actions {
  transition: all 0.3s ease; /* Statt 0.25s cubic-bezier */
}
```

### Positionen anpassen
```css
.stack-quick-actions {
  top: var(--space-sm);    /* Näher zum oberen Rand */
  right: var(--space-sm);  /* Näher zum rechten Rand */
}
```

## Testing

### Desktop
1. Hover über Stack-Karte
2. Quick Actions erscheinen smooth
3. Hover über Action-Button zeigt spezifische Farbe
4. Klick führt korrekte Action aus
5. Toast-Nachricht erscheint

### Mobile
1. Resize Browser auf <768px
2. Quick Actions verschwinden
3. Three-Dots Button erscheint
4. Touch auf Button führt Action aus

### Performance
- Smooth 60fps Animationen
- Keine Layout-Shifts
- Schnelle Hover-Response

## Future Enhancements

### Mobile Action Menu
```css
.mobile-action-menu {
  /* Implementierung eines Dropdown-Menüs */
  position: absolute;
  top: calc(100% + var(--space-xs));
  right: var(--space-md);
}
```

### Keyboard Navigation
- Tab-Navigation durch Quick Actions
- Enter/Space für Action-Ausführung
- Escape zum Schließen

### Animation Sequences
- Staggered Action-Button Erscheinen
- Micro-Interactions für besseres UX
- Loading States für API-Calls

## Code-Standorte

### CSS
- `src/css/dashboard.css` (Zeile ~1132+)
- Quick Actions Styles
- Responsive Media Queries

### JavaScript
- `src/js/dashboard.js` (createCompactStackCard, createImmersiveStackCard)
- Event Handlers
- Action Functions

### HTML
- Dynamisch generiert in JavaScript
- Template-Strings in Card-Creation Functions 