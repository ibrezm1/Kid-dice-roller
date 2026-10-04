/**
 * Kids TV Time Dice Roller - Main App Coordinator
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const rollDiceBtn = document.getElementById('rollDiceBtn');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const historyToggleBtn = document.getElementById('historyToggleBtn');
  const historyCountEl = document.getElementById('historyCount');
  
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const voiceToggleBtn = document.getElementById('voiceToggleBtn');
  const voiceIcon = document.getElementById('voiceIcon');
  
  const kidLockBtn = document.getElementById('kidLockBtn');
  const kidLockIcon = document.getElementById('kidLockIcon');
  const kidLockText = document.getElementById('kidLockText');

  const presetSelect = document.getElementById('presetSelect');
  const activePresetBadge = document.getElementById('activePresetBadge');
  const facesLegendGrid = document.getElementById('facesLegendGrid');
  const quickEditBtn = document.getElementById('quickEditBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  const resultBadge = document.getElementById('resultBadge');
  const resultText = document.getElementById('resultText');
  const resultEmoji = document.getElementById('resultEmoji');

  // Modals
  const settingsModal = document.getElementById('settingsModal');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const saveFacesBtn = document.getElementById('saveFacesBtn');
  const restorePresetDefaultsBtn = document.getElementById('restorePresetDefaultsBtn');
  const saveAsNewPresetBtn = document.getElementById('saveAsNewPresetBtn');
  const deletePresetBtn = document.getElementById('deletePresetBtn');
  const presetChipsContainer = document.getElementById('presetChipsContainer');
  const facesFormGrid = document.getElementById('facesFormGrid');

  const historyModal = document.getElementById('historyModal');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const closeHistoryBottomBtn = document.getElementById('closeHistoryBottomBtn');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  const kidLockModal = document.getElementById('kidLockModal');
  const closeKidLockBtn = document.getElementById('closeKidLockBtn');
  const cancelKidLockBtn = document.getElementById('cancelKidLockBtn');
  const submitKidLockBtn = document.getElementById('submitKidLockBtn');
  const mathProblemText = document.getElementById('mathProblemText');
  const mathAnswerInput = document.getElementById('mathAnswerInput');
  const mathErrorText = document.getElementById('mathErrorText');

  // State
  let currentPreset = window.storageManager.getCurrentPreset();
  let lastRollResult = null;
  let isKidLocked = false;
  let mathTargetAnswer = 0;

  // Fun emojis for picker
  const AVAILABLE_EMOJIS = ['⚡', '🍿', '🎬', '🚀', '🌟', '👑', '🎮', '🧸', '🏰', '🏆', '🍕', '🎉', '⚽', '🎨', '🍭', '🦄'];

  // Initialize App
  function init() {
    loadSettings();
    renderPresetDropdown();
    applyCurrentPreset();
    updateHistoryCount();
    setupEventHandlers();
  }

  function loadSettings() {
    const settings = window.storageManager.getSettings();
    window.soundEngine.soundEnabled = settings.sound !== false;
    window.soundEngine.voiceEnabled = settings.voice !== false;
    isKidLocked = settings.kidLock === true;

    updateSoundButton();
    updateVoiceButton();
    updateKidLockButton();
  }

  function updateSoundButton() {
    if (window.soundEngine.soundEnabled) {
      soundIcon.textContent = '🔊';
      soundToggleBtn.classList.remove('muted');
    } else {
      soundIcon.textContent = '🔇';
      soundToggleBtn.classList.add('muted');
    }
  }

  function updateVoiceButton() {
    if (window.soundEngine.voiceEnabled) {
      voiceIcon.textContent = '🗣️';
      voiceToggleBtn.classList.add('active');
      voiceToggleBtn.classList.remove('muted');
    } else {
      voiceIcon.textContent = '🤐';
      voiceToggleBtn.classList.remove('active');
      voiceToggleBtn.classList.add('muted');
    }
  }

  function updateKidLockButton() {
    if (isKidLocked) {
      kidLockIcon.textContent = '🔒';
      if (kidLockText) kidLockText.textContent = 'Kids Mode';
      kidLockBtn.classList.add('locked');
      openSettingsBtn.style.opacity = '0.6';
      quickEditBtn.style.opacity = '0.6';
      resetDefaultsBtn.style.opacity = '0.6';
    } else {
      kidLockIcon.textContent = '🔓';
      if (kidLockText) kidLockText.textContent = 'Parent Mode';
      kidLockBtn.classList.remove('locked');
      openSettingsBtn.style.opacity = '1';
      quickEditBtn.style.opacity = '1';
      resetDefaultsBtn.style.opacity = '1';
    }
  }

  // Render Preset selector in header
  function renderPresetDropdown() {
    const presets = window.storageManager.getPresets();
    const currentId = window.storageManager.getCurrentPresetId();

    presetSelect.innerHTML = '';
    presets.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      if (p.id === currentId) opt.selected = true;
      presetSelect.appendChild(opt);
    });
  }

  // Apply current active preset to 3D cube and UI legend
  function applyCurrentPreset() {
    currentPreset = window.storageManager.getCurrentPreset();
    if (!currentPreset) return;

    if (activePresetBadge) {
      activePresetBadge.textContent = currentPreset.name.replace(/[^\w\s()]/gi, '').trim();
    }

    // Update 3D Cube faces
    window.diceController.renderFaces(currentPreset.faces);

    // Update Left side Legend Cards
    renderLegendCards(currentPreset.faces);
  }

  // Render 6 cards on Left Legend Panel
  function renderLegendCards(faces) {
    if (!facesLegendGrid) return;
    facesLegendGrid.innerHTML = '';

    faces.forEach((face, idx) => {
      const card = document.createElement('div');
      card.className = 'legend-card';
      card.id = `legendCard_${idx + 1}`;
      card.style.setProperty('--card-color', face.color || '#8b5cf6');

      card.innerHTML = `
        <div class="legend-pip-num">${face.pip || (idx + 1)}</div>
        <div class="legend-info">
          <div class="legend-label-row">
            <span class="legend-emoji">${face.emoji || '🎲'}</span>
            <span class="legend-label">${face.label || `${face.minutes} Mins`}</span>
          </div>
          <span class="legend-sub">${face.sub || `${face.minutes} min reward`}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (!window.diceController.isRolling) {
          window.soundEngine.playPop(500);
          window.diceController.roll(idx + 1);
        }
      });

      facesLegendGrid.appendChild(card);
    });
  }

  // Setup Event Listeners
  function setupEventHandlers() {
    // Preset dropdown change
    presetSelect.addEventListener('change', (e) => {
      window.storageManager.setCurrentPresetId(e.target.value);
      applyCurrentPreset();
      window.soundEngine.playPop(550);
    });

    // Sound toggle
    soundToggleBtn.addEventListener('click', () => {
      window.soundEngine.soundEnabled = !window.soundEngine.soundEnabled;
      updateSoundButton();
      window.storageManager.saveSettings({
        sound: window.soundEngine.soundEnabled,
        voice: window.soundEngine.voiceEnabled,
        kidLock: isKidLocked
      });
      if (window.soundEngine.soundEnabled) {
        window.soundEngine.playPop(600);
      }
    });

    // Voice toggle
    voiceToggleBtn.addEventListener('click', () => {
      window.soundEngine.voiceEnabled = !window.soundEngine.voiceEnabled;
      updateVoiceButton();
      window.storageManager.saveSettings({
        sound: window.soundEngine.soundEnabled,
        voice: window.soundEngine.voiceEnabled,
        kidLock: isKidLocked
      });
      if (window.soundEngine.voiceEnabled) {
        window.soundEngine.speak("Voice announcer ready!");
      }
    });

    // Kid Lock toggle button
    kidLockBtn.addEventListener('click', () => {
      if (isKidLocked) {
        // Show math challenge to unlock
        openKidLockModal();
      } else {
        // Lock immediately
        isKidLocked = true;
        updateKidLockButton();
        window.storageManager.saveSettings({
          sound: window.soundEngine.soundEnabled,
          voice: window.soundEngine.voiceEnabled,
          kidLock: true
        });
        window.soundEngine.playPop(450);
      }
    });

    // Throw Dice Button
    rollDiceBtn.addEventListener('click', () => {
      window.diceController.roll();
    });

    // Spacebar to roll
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        window.diceController.roll();
      }
      if (e.code === 'Escape') {
        closeAllModals();
      }
    });

    // Dice roll callbacks
    window.diceController.onRollStart = () => {
      rollDiceBtn.disabled = true;
      startTimerBtn.disabled = true;
      startTimerBtn.classList.add('disabled');
      resultBadge.classList.remove('highlight');
      resultText.textContent = 'Rolling magic dice... 🎲';
      resultEmoji.textContent = '✨';

      // Clear previous active card highlight
      document.querySelectorAll('.legend-card').forEach(c => c.classList.remove('active-roll'));
    };

    window.diceController.onRollEnd = (faceNumber) => {
      rollDiceBtn.disabled = false;
      const faceData = currentPreset.faces[faceNumber - 1];
      lastRollResult = faceData;

      // Update Result Ribbon
      resultBadge.classList.add('highlight');
      resultText.textContent = `You got ${faceData.label}! (${faceData.minutes} Mins)`;
      resultEmoji.textContent = faceData.emoji || '🎉';

      // Highlight corresponding card in Legend
      const activeCard = document.getElementById(`legendCard_${faceNumber}`);
      if (activeCard) {
        activeCard.classList.add('active-roll');
      }

      // Enable and update Start Timer button
      startTimerBtn.disabled = false;
      startTimerBtn.classList.remove('disabled');
      startTimerBtn.innerHTML = `<span>⏱️ Start ${faceData.minutes}m Timer</span>`;

      // Voice Announce
      const announcement = `Hooray! You rolled a ${faceNumber}, which gives you ${faceData.label}! ${faceData.sub}`;
      window.soundEngine.speak(announcement);

      // Save to History Log
      window.storageManager.addHistoryItem({
        face: faceNumber,
        label: faceData.label,
        minutes: faceData.minutes,
        emoji: faceData.emoji,
        color: faceData.color,
        presetName: currentPreset.name
      });
      updateHistoryCount();
    };

    // Quick Start Timer from roll
    startTimerBtn.addEventListener('click', () => {
      if (!lastRollResult) return;
      window.screenTimer.setDuration(lastRollResult.minutes, `${lastRollResult.label} (${lastRollResult.emoji})`);
      window.screenTimer.start();
      window.soundEngine.playPop(650);

      // Smooth scroll to timer on mobile
      if (window.innerWidth < 1100) {
        document.getElementById('timerPanel').scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Reset Defaults Button on Legend panel
    resetDefaultsBtn.addEventListener('click', () => {
      if (isKidLocked) {
        openKidLockModal();
        return;
      }
      if (confirm('Reset dice faces back to default standard TV times (2m, 5m, 10m, 20m, 30m, 1h)?')) {
        window.storageManager.resetCurrentToDefault();
        applyCurrentPreset();
        renderPresetDropdown();
        window.soundEngine.playPop(500);
      }
    });

    // Settings Modal Triggers
    const triggerSettings = () => {
      if (isKidLocked) {
        openKidLockModal();
        return;
      }
      openSettingsModal();
    };

    openSettingsBtn.addEventListener('click', triggerSettings);
    quickEditBtn.addEventListener('click', triggerSettings);

    closeSettingsBtn.addEventListener('click', () => closeSettingsModal());
    cancelSettingsBtn.addEventListener('click', () => closeSettingsModal());

    saveFacesBtn.addEventListener('click', () => saveFacesFromForm());
    restorePresetDefaultsBtn.addEventListener('click', () => {
      window.storageManager.resetCurrentToDefault();
      renderFacesEditForm();
      applyCurrentPreset();
      window.soundEngine.playPop(520);
    });

    saveAsNewPresetBtn.addEventListener('click', () => createNewPresetPrompt());
    deletePresetBtn.addEventListener('click', () => deleteCurrentPreset());

    // History Modal Triggers
    historyToggleBtn.addEventListener('click', () => openHistoryModal());
    closeHistoryBtn.addEventListener('click', () => closeHistoryModal());
    closeHistoryBottomBtn.addEventListener('click', () => closeHistoryModal());
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Clear all roll history?')) {
        window.storageManager.clearHistory();
        renderHistoryList();
        updateHistoryCount();
      }
    });

    // Kid Lock Modal Triggers
    closeKidLockBtn.addEventListener('click', () => closeKidLockModal());
    cancelKidLockBtn.addEventListener('click', () => closeKidLockModal());
    submitKidLockBtn.addEventListener('click', () => verifyKidLockMath());
    mathAnswerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyKidLockMath();
    });

    // Click outside modal backdrop to close
    [settingsModal, historyModal, kidLockModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  // ==========================================
  // Settings & Customizer Modal Functions
  // ==========================================

  function openSettingsModal() {
    renderPresetChips();
    renderFacesEditForm();
    settingsModal.classList.add('active');
    window.soundEngine.playPop(500);
  }

  function closeSettingsModal() {
    settingsModal.classList.remove('active');
  }

  function renderPresetChips() {
    presetChipsContainer.innerHTML = '';
    const presets = window.storageManager.getPresets();
    const currentId = window.storageManager.getCurrentPresetId();

    presets.forEach(p => {
      const chip = document.createElement('button');
      chip.className = `preset-chip ${p.id === currentId ? 'active' : ''}`;
      chip.innerHTML = `<span>${p.name}</span>`;
      chip.addEventListener('click', () => {
        window.storageManager.setCurrentPresetId(p.id);
        currentPreset = window.storageManager.getCurrentPreset();
        renderPresetChips();
        renderFacesEditForm();
        applyCurrentPreset();
        renderPresetDropdown();
        window.soundEngine.playPop(520);
      });
      presetChipsContainer.appendChild(chip);
    });

    // Hide/Show delete button if it's built-in
    deletePresetBtn.style.display = currentPreset.isBuiltIn ? 'none' : 'inline-flex';
  }

  function renderFacesEditForm() {
    facesFormGrid.innerHTML = '';
    currentPreset = window.storageManager.getCurrentPreset();

    currentPreset.faces.forEach((face, idx) => {
      const faceCard = document.createElement('div');
      faceCard.className = 'face-edit-card';
      faceCard.style.setProperty('--face-color', face.color || '#8b5cf6');

      faceCard.innerHTML = `
        <div class="face-edit-header">
          <span class="face-num-badge" style="background:${face.color || '#8b5cf6'}">${face.pip || (idx + 1)}</span>
          <span style="font-weight:700; font-size:0.85rem; color:#fbcfe8;">Face ${idx + 1}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="faceLabel_${idx}">Display Label</label>
          <input type="text" id="faceLabel_${idx}" class="form-input" value="${face.label || ''}" placeholder="e.g. 20 Mins">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="faceMinutes_${idx}">Minutes</label>
            <input type="number" id="faceMinutes_${idx}" class="form-input" value="${face.minutes || 10}" min="1" max="180">
          </div>
          <div class="form-group">
            <label class="form-label" for="faceEmoji_${idx}">Emoji</label>
            <select id="faceEmoji_${idx}" class="form-input emoji-select-btn">
              ${AVAILABLE_EMOJIS.map(em => `<option value="${em}" ${em === face.emoji ? 'selected' : ''}>${em}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="faceSub_${idx}">Subtext / Activity</label>
            <input type="text" id="faceSub_${idx}" class="form-input" value="${face.sub || ''}" placeholder="e.g. Movie Time">
          </div>
          <div class="form-group">
            <label class="form-label" for="faceColor_${idx}">Theme Color</label>
            <input type="color" id="faceColor_${idx}" class="color-input" value="${face.color || '#8b5cf6'}">
          </div>
        </div>
      `;

      facesFormGrid.appendChild(faceCard);
    });
  }

  function saveFacesFromForm() {
    const newFaces = [];
    for (let i = 0; i < 6; i++) {
      const labelInput = document.getElementById(`faceLabel_${i}`);
      const minutesInput = document.getElementById(`faceMinutes_${i}`);
      const emojiInput = document.getElementById(`faceEmoji_${i}`);
      const subInput = document.getElementById(`faceSub_${i}`);
      const colorInput = document.getElementById(`faceColor_${i}`);

      const minutes = parseInt(minutesInput.value, 10) || 5;
      const color = colorInput.value || '#8b5cf6';

      newFaces.push({
        pip: i + 1,
        label: labelInput.value.trim() || `${minutes} Mins`,
        minutes: minutes,
        emoji: emojiInput.value,
        sub: subInput.value.trim() || 'Screen Reward',
        color: color,
        bg: `${color}20` // 12% alpha
      });
    }

    window.storageManager.saveCurrentPresetFaces(newFaces);
    applyCurrentPreset();
    closeSettingsModal();
    window.soundEngine.playCelebrationFanfare();
  }

  function createNewPresetPrompt() {
    const presetName = prompt('Enter a name for your new custom preset:', '✨ My Fun Theme');
    if (!presetName || !presetName.trim()) return;

    // Use current faces as starting template
    const currentFaces = JSON.parse(JSON.stringify(currentPreset.faces));
    const created = window.storageManager.createPreset(presetName.trim(), currentFaces);
    currentPreset = created;

    renderPresetChips();
    renderFacesEditForm();
    applyCurrentPreset();
    renderPresetDropdown();
    window.soundEngine.playPop(600);
  }

  function deleteCurrentPreset() {
    if (confirm(`Are you sure you want to delete preset "${currentPreset.name}"?`)) {
      window.storageManager.deletePreset(currentPreset.id);
      currentPreset = window.storageManager.getCurrentPreset();
      renderPresetChips();
      renderFacesEditForm();
      applyCurrentPreset();
      renderPresetDropdown();
      window.soundEngine.playPop(400);
    }
  }

  // ==========================================
  // History Modal Functions
  // ==========================================

  function updateHistoryCount() {
    const history = window.storageManager.getHistory();
    if (historyCountEl) {
      historyCountEl.textContent = history.length;
    }
  }

  function openHistoryModal() {
    renderHistoryList();
    historyModal.classList.add('active');
    window.soundEngine.playPop(500);
  }

  function closeHistoryModal() {
    historyModal.classList.remove('active');
  }

  function renderHistoryList() {
    const history = window.storageManager.getHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No dice rolls yet. Give it a throw! 🎲</div>';
      return;
    }

    history.forEach(item => {
      const row = document.createElement('div');
      row.className = 'history-item';
      row.innerHTML = `
        <div class="history-item-left">
          <div class="history-pip" style="background:${item.color || '#8b5cf6'}">${item.face}</div>
          <div>
            <div style="font-weight:700; color:#fff;">${item.emoji || ''} ${item.label}</div>
            <div style="font-size:0.75rem; color:#94a3b8;">${item.minutes} minutes (${item.presetName || 'Preset'})</div>
          </div>
        </div>
        <span class="history-time">${item.timestamp}</span>
      `;
      historyList.appendChild(row);
    });
  }

  // ==========================================
  // Kid Lock Parental Security Check
  // ==========================================

  function openKidLockModal() {
    const num1 = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const num2 = Math.floor(Math.random() * 8) + 3; // 3 to 10
    mathTargetAnswer = num1 * num2;

    mathProblemText.textContent = `${num1} × ${num2} = ?`;
    mathAnswerInput.value = '';
    mathErrorText.style.display = 'none';

    kidLockModal.classList.add('active');
    setTimeout(() => mathAnswerInput.focus(), 150);
  }

  function closeKidLockModal() {
    kidLockModal.classList.remove('active');
  }

  function verifyKidLockMath() {
    const val = parseInt(mathAnswerInput.value, 10);
    if (val === mathTargetAnswer) {
      // Unlocked!
      isKidLocked = false;
      updateKidLockButton();
      window.storageManager.saveSettings({
        sound: window.soundEngine.soundEnabled,
        voice: window.soundEngine.voiceEnabled,
        kidLock: false
      });
      closeKidLockModal();
      window.soundEngine.playPop(700);
      openSettingsModal();
    } else {
      mathErrorText.style.display = 'block';
      mathAnswerInput.value = '';
      mathAnswerInput.focus();
      window.soundEngine.playPop(200);
    }
  }

  function closeAllModals() {
    settingsModal.classList.remove('active');
    historyModal.classList.remove('active');
    kidLockModal.classList.remove('active');
  }

  // Kickstart!
  init();
});
