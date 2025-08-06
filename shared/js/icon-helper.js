/**
 * Icon Helper Module für FOSS Stack Hub
 * Bietet dynamische Icon-Unterstützung für JavaScript
 */

export const icons = {
  // Rating & Engagement
  star: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`,
  
  thumbsUp: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
  </svg>`,
  
  heart: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`,

  // Actions
  download: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
  </svg>`,
  
  storage: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
  </svg>`,

  // Categories
  design: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7"/>
  </svg>`,
  
  development: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>`,
  
  audio: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM21 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
  </svg>`,
  
  video: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
  </svg>`,

  // Performance & Stats  
  fire: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 2.76 1.58 5.14 3.89 6.3L12 16l2.11-1.7C16.42 13.14 18 10.76 18 8c0-3.31-2.69-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>`,
  
  trending: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
  </svg>`,
  
  rocket: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
  </svg>`,

  // Social & Community
  users: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
  </svg>`
};

/**
 * Erstellt ein Icon-Element
 * @param {string} name - Name des Icons
 * @param {string} className - CSS-Klasse(n)
 * @param {number} size - Größe des Icons (width/height)
 * @returns {string} SVG HTML string
 */
export function createIcon(name, className = '', size = 16) {
  if (!icons[name]) {
    console.warn(`Icon "${name}" nicht gefunden`);
    return `<span class="icon-missing">[${name}]</span>`;
  }
  
  let svg = icons[name];
  
  // Größe anpassen
  svg = svg.replace(/width="[^"]*"/, `width="${size}"`);
  svg = svg.replace(/height="[^"]*"/, `height="${size}"`);
  
  // CSS-Klasse hinzufügen
  if (className) {
    svg = svg.replace('<svg', `<svg class="${className}"`);
  }
  
  return svg;
}

/**
 * Ersetzt Emojis in einem HTML-String durch Icons
 * @param {string} html - HTML String mit Emojis
 * @returns {string} HTML String mit Icons
 */
export function replaceEmojisWithIcons(html) {
  const emojiMap = {
    '⭐': createIcon('star', 'icon icon-stat', 14),
    '📥': createIcon('download', 'icon icon-stat', 14),
    '💾': createIcon('storage', 'icon icon-stat', 14),
    '👍': createIcon('thumbsUp', 'icon icon-stat', 14),
    '❤️': createIcon('heart', 'icon', 14),
    '🎨': createIcon('design', 'icon icon-category', 16),
    '💻': createIcon('development', 'icon icon-category', 16),
    '🎵': createIcon('audio', 'icon icon-category', 16),
    '🎬': createIcon('video', 'icon icon-category', 16),
    '🚀': createIcon('rocket', 'icon', 16),
    '🔥': createIcon('fire', 'icon', 16),
    '👥': createIcon('users', 'icon', 16)
  };
  
  let result = html;
  for (const [emoji, iconSvg] of Object.entries(emojiMap)) {
    result = result.replace(new RegExp(emoji, 'g'), iconSvg);
  }
  
  return result;
}

/**
 * Initialisiert das Icon-System für eine Seite
 */
export function initIconSystem() {
  // Suche nach allen .emoji-to-icon Elementen und ersetze sie
  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.emoji-to-icon');
    elements.forEach(element => {
      element.innerHTML = replaceEmojisWithIcons(element.innerHTML);
    });
  });
  
  // Globale Funktion für dynamisches Icon-Erstellen
  if (typeof window !== 'undefined') {
    window.createIcon = createIcon;
    window.replaceEmojisWithIcons = replaceEmojisWithIcons;
  }
}

// Auto-init wenn als Script geladen
if (typeof document !== 'undefined') {
  initIconSystem();
} 