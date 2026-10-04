/**
 * Kids TV Time Dice Roller - 3D Cube Controller & Physics Engine
 * Handles 3D CSS transforms, swipe-to-throw, shake detection, and landing alignment
 */

class Dice3DController {
  constructor() {
    this.cube = document.getElementById('diceCube');
    this.viewport = document.getElementById('diceViewport');
    this.isRolling = false;
    this.currentFace = 1;
    this.rotX = -20;
    this.rotY = 30;
    this.rotZ = 0;
    this.totalRotX = -20;
    this.totalRotY = 30;

    // Face rotation map to align each face squarely to the camera
    this.faceRotations = {
      1: { x: 0, y: 0, z: 0 },         // Front
      2: { x: -90, y: 0, z: 0 },       // Top
      3: { x: 0, y: -90, z: 0 },       // Right
      4: { x: 0, y: 90, z: 0 },        // Left
      5: { x: 90, y: 0, z: 0 },        // Bottom
      6: { x: 0, y: 180, z: 0 }        // Back
    };

    this.onRollStart = null;
    this.onRollEnd = null;

    this.initEvents();
    this.initShakeDetection();
  }

  initEvents() {
    if (!this.viewport) return;

    // Click on viewport
    this.viewport.addEventListener('click', (e) => {
      // If clicking directly on viewport or cube
      if (!this.isRolling) {
        this.roll();
      }
    });

    // Touch / Mouse Drag & Swipe to throw
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDragging = false;

    const onPointerDown = (clientX, clientY) => {
      if (this.isRolling) return;
      startX = clientX;
      startY = clientY;
      startTime = Date.now();
      isDragging = true;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging || this.isRolling) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      // Slight interactive tilt while dragging
      this.cube.style.transition = 'none';
      this.cube.style.transform = `rotateX(${this.totalRotX - dy * 0.4}deg) rotateY(${this.totalRotY + dx * 0.4}deg)`;
    };

    const onPointerUp = (clientX, clientY) => {
      if (!isDragging || this.isRolling) {
        isDragging = false;
        return;
      }
      isDragging = false;
      const dx = clientX - startX;
      const dy = clientY - startY;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(Date.now() - startTime, 50);
      const speed = dist / dt;

      // If dragged with enough distance or speed, trigger throw with bias
      if (dist > 25 || speed > 0.3) {
        this.roll();
      } else {
        // Reset tilt back to current orientation
        this.cube.style.transition = 'transform 0.4s ease-out';
        this.cube.style.transform = `rotateX(${this.totalRotX}deg) rotateY(${this.totalRotY}deg)`;
      }
    };

    this.viewport.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', (e) => onPointerUp(e.clientX, e.clientY));

    this.viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        onPointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    }, { passive: true });
  }

  // Mobile Device Shake detector
  initShakeDetection() {
    let lastX = null, lastY = null, lastZ = null;
    let lastTime = 0;
    const SHAKE_THRESHOLD = 16;

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        if (this.isRolling) return;
        const current = e.accelerationIncludingGravity;
        if (!current || current.x === null) return;

        const now = Date.now();
        if ((now - lastTime) > 100) {
          const diffTime = now - lastTime;
          lastTime = now;

          if (lastX !== null) {
            const deltaX = Math.abs(current.x - lastX);
            const deltaY = Math.abs(current.y - lastY);
            const deltaZ = Math.abs(current.z - lastZ);
            const speed = ((deltaX + deltaY + deltaZ) / diffTime) * 10000;

            if (speed > SHAKE_THRESHOLD * 100) {
              this.roll();
            }
          }

          lastX = current.x;
          lastY = current.y;
          lastZ = current.z;
        }
      });
    }
  }

  // Roll the dice with realistic tumble spins and land on a random face 1-6
  roll(targetFace = null) {
    if (this.isRolling) return;
    this.isRolling = true;

    // Pick random face 1-6 if not specified
    const chosenFace = targetFace || (Math.floor(Math.random() * 6) + 1);
    this.currentFace = chosenFace;

    if (this.onRollStart) {
      this.onRollStart();
    }

    if (window.soundEngine) {
      window.soundEngine.playRollRattle();
    }

    if (this.viewport) {
      this.viewport.classList.add('is-rolling');
    }

    // Generate dynamic multi-axis tumbling
    const minSpins = 4;
    const maxSpins = 7;
    const spinsX = minSpins + Math.floor(Math.random() * (maxSpins - minSpins));
    const spinsY = minSpins + Math.floor(Math.random() * (maxSpins - minSpins));

    const targetRot = this.faceRotations[chosenFace];

    // Compute continuous accumulator to avoid snapping backwards
    const roundToMultiple = (val, step) => Math.ceil(val / step) * step;
    this.totalRotX = roundToMultiple(this.totalRotX + (spinsX * 360), 360) + targetRot.x;
    this.totalRotY = roundToMultiple(this.totalRotY + (spinsY * 360), 360) + targetRot.y;

    // Apply cubic bezier bounce settling
    this.cube.style.transition = 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1.25)';
    this.cube.style.transform = `rotateX(${this.totalRotX}deg) rotateY(${this.totalRotY}deg)`;

    // Midway bounce sound
    setTimeout(() => {
      if (window.soundEngine) {
        window.soundEngine.playDiceThud();
      }
    }, 900);

    // Roll completion
    setTimeout(() => {
      this.isRolling = false;
      if (this.viewport) {
        this.viewport.classList.remove('is-rolling');
      }

      if (window.soundEngine) {
        window.soundEngine.playCelebrationFanfare();
      }

      if (window.confettiEngine) {
        window.confettiEngine.explode(80);
      }

      if (this.onRollEnd) {
        this.onRollEnd(chosenFace);
      }
    }, 1400);
  }

  // Update faces rendering on the 3D cube
  renderFaces(faces) {
    if (!faces || faces.length < 6) return;

    for (let i = 1; i <= 6; i++) {
      const faceEl = this.cube.querySelector(`.face-${i}`);
      const faceData = faces[i - 1];
      if (!faceEl || !faceData) continue;

      faceEl.style.setProperty('--face-accent', faceData.color || '#8b5cf6');
      faceEl.style.setProperty('--face-bg', faceData.bg || 'rgba(139, 92, 246, 0.08)');

      const pipBadge = faceEl.querySelector('.face-pip-badge');
      const emojiEl = faceEl.querySelector('.face-emoji');
      const labelEl = faceEl.querySelector('.face-label');
      const subEl = faceEl.querySelector('.face-sub');

      if (pipBadge) pipBadge.textContent = faceData.pip || i;
      if (emojiEl) emojiEl.textContent = faceData.emoji || '🎲';
      if (labelEl) labelEl.textContent = faceData.label || `${faceData.minutes} Mins`;
      if (subEl) subEl.textContent = faceData.sub || 'Reward';
    }
  }
}

window.diceController = new Dice3DController();
