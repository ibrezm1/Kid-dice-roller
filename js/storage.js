/**
 * Kids TV Time Dice Roller - Storage & State Management
 * Persistent localStorage handling for presets, custom faces, history, and user settings
 */

const STORAGE_KEYS = {
  CURRENT_PRESET_ID: 'kids_dice_current_preset_id',
  PRESETS: 'kids_dice_presets',
  HISTORY: 'kids_dice_history',
  SETTINGS: 'kids_dice_settings'
};

// Default Standard Presets
const DEFAULT_PRESETS = [
  {
    id: 'tv_screen_time',
    name: '📺 TV Screen Time (Default)',
    isBuiltIn: true,
    faces: [
      { pip: 1, label: '2 Mins', minutes: 2, emoji: '⚡', sub: 'Quick Sneak Peek', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
      { pip: 2, label: '5 Mins', minutes: 5, emoji: '🍿', sub: 'Short Cartoon Clip', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
      { pip: 3, label: '10 Mins', minutes: 10, emoji: '🎬', sub: 'Mini Episode', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
      { pip: 4, label: '20 Mins', minutes: 20, emoji: '🚀', sub: 'Full TV Show', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
      { pip: 5, label: '30 Mins', minutes: 30, emoji: '🌟', sub: 'Double Show Fun', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
      { pip: 6, label: '1 Hour', minutes: 60, emoji: '👑', sub: 'MEGA MOVIE TIME!', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.14)' }
    ]
  },
  {
    id: 'bedtime_stories',
    name: '🌙 Bedtime Story Time',
    isBuiltIn: true,
    faces: [
      { pip: 1, label: '1 Story', minutes: 5, emoji: '📖', sub: 'Quick Rhyme', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
      { pip: 2, label: '2 Stories', minutes: 10, emoji: '🧸', sub: 'Teddy Story', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)' },
      { pip: 3, label: '15 Mins', minutes: 15, emoji: '✨', sub: 'Fairy Tale', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)' },
      { pip: 4, label: '20 Mins', minutes: 20, emoji: '🚀', sub: 'Space Adventure', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)' },
      { pip: 5, label: '30 Mins', minutes: 30, emoji: '🏰', sub: 'Castle Quest', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
      { pip: 6, label: 'Lullaby + 45m', minutes: 45, emoji: '🌟', sub: 'Grand Storytime', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' }
    ]
  },
  {
    id: 'outdoor_play',
    name: '⚽ Playground & Outdoor Fun',
    isBuiltIn: true,
    faces: [
      { pip: 1, label: '10 Mins', minutes: 10, emoji: '🛴', sub: 'Scooter Dash', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
      { pip: 2, label: '15 Mins', minutes: 15, emoji: '🚲', sub: 'Bike Ride', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
      { pip: 3, label: '20 Mins', minutes: 20, emoji: '⚽', sub: 'Soccer Kick', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
      { pip: 4, label: '30 Mins', minutes: 30, emoji: '🛝', sub: 'Playground', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
      { pip: 5, label: '45 Mins', minutes: 45, emoji: '🪁', sub: 'Park Trip', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
      { pip: 6, label: '1 Hour', minutes: 60, emoji: '🏆', sub: 'Adventure Day', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' }
    ]
  },
  {
    id: 'game_console',
    name: '🎮 Video Game Time',
    isBuiltIn: true,
    faces: [
      { pip: 1, label: '5 Mins', minutes: 5, emoji: '👾', sub: 'One Level Run', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
      { pip: 2, label: '10 Mins', minutes: 10, emoji: '🕹️', sub: 'Quick Match', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
      { pip: 3, label: '15 Mins', minutes: 15, emoji: '🏎️', sub: 'Kart Race', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
      { pip: 4, label: '25 Mins', minutes: 25, emoji: '🧩', sub: 'Puzzle Boss', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
      { pip: 5, label: '40 Mins', minutes: 40, emoji: '🏰', sub: 'Co-op Quest', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
      { pip: 6, label: '1 Hour', minutes: 60, emoji: '👑', sub: 'Grand Tournament', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' }
    ]
  }
];

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRESETS)) {
      this.savePresets(DEFAULT_PRESETS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PRESET_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PRESET_ID, 'tv_screen_time');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings({
        sound: true,
        voice: true,
        kidLock: false
      });
    }
  }

  getPresets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRESETS);
      return data ? JSON.parse(data) : DEFAULT_PRESETS;
    } catch (e) {
      console.error('Failed to get presets:', e);
      return DEFAULT_PRESETS;
    }
  }

  savePresets(presets) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
    } catch (e) {
      console.error('Failed to save presets:', e);
    }
  }

  getCurrentPresetId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PRESET_ID) || 'tv_screen_time';
  }

  setCurrentPresetId(id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRESET_ID, id);
  }

  getCurrentPreset() {
    const presets = this.getPresets();
    const currentId = this.getCurrentPresetId();
    return presets.find(p => p.id === currentId) || presets[0] || DEFAULT_PRESETS[0];
  }

  saveCurrentPresetFaces(faces) {
    const presets = this.getPresets();
    const currentId = this.getCurrentPresetId();
    const presetIndex = presets.findIndex(p => p.id === currentId);

    if (presetIndex !== -1) {
      presets[presetIndex].faces = faces;
      this.savePresets(presets);
    }
  }

  createPreset(name, faces) {
    const presets = this.getPresets();
    const newId = 'preset_' + Date.now();
    const newPreset = {
      id: newId,
      name: name,
      isBuiltIn: false,
      faces: faces
    };
    presets.push(newPreset);
    this.savePresets(presets);
    this.setCurrentPresetId(newId);
    return newPreset;
  }

  deletePreset(id) {
    let presets = this.getPresets();
    const target = presets.find(p => p.id === id);
    if (!target || target.isBuiltIn) {
      return false; // Cannot delete built-in presets
    }
    presets = presets.filter(p => p.id !== id);
    this.savePresets(presets);
    this.setCurrentPresetId('tv_screen_time');
    return true;
  }

  resetCurrentToDefault() {
    const presets = this.getPresets();
    const currentId = this.getCurrentPresetId();
    const defaultTemplate = DEFAULT_PRESETS.find(p => p.id === currentId) || DEFAULT_PRESETS[0];
    
    const idx = presets.findIndex(p => p.id === currentId);
    if (idx !== -1) {
      presets[idx].faces = JSON.parse(JSON.stringify(defaultTemplate.faces));
      this.savePresets(presets);
    }
    return presets[idx];
  }

  // History Log Management
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addHistoryItem(item) {
    const history = this.getHistory();
    history.unshift({
      ...item,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    // Keep last 50 items
    if (history.length > 50) history.pop();
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {}
    return history;
  }

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { sound: true, voice: true, kidLock: false };
    } catch (e) {
      return { sound: true, voice: true, kidLock: false };
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }
}

window.storageManager = new StorageManager();
