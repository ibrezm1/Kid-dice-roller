/**
 * Kids TV Time Dice Roller - Screen Time Countdown Timer
 * Circular progress ring, play/pause/reset, sound alerts & voice announcements
 */

class ScreenTimeTimer {
  constructor() {
    this.totalSeconds = 0;
    this.remainingSeconds = 0;
    this.timerInterval = null;
    this.isRunning = false;
    this.isPaused = false;

    // Elements
    this.digitsEl = document.getElementById('timerDigits');
    this.subtextEl = document.getElementById('timerSubtext');
    this.progressCircle = document.getElementById('timerCircleProgress');
    this.statusDot = document.getElementById('timerStatusDot');
    this.playPauseBtn = document.getElementById('timerPlayPauseBtn');
    this.playPauseIcon = document.getElementById('playPauseIcon');
    this.playPauseText = document.getElementById('playPauseText');
    this.resetBtn = document.getElementById('timerResetBtn');
    this.btnSub1 = document.getElementById('timerSub1Min');
    this.btnAdd1 = document.getElementById('timerAdd1Min');
    this.btnAdd5 = document.getElementById('timerAdd5Min');

    this.circumference = 2 * Math.PI * 85; // ~534.07
    if (this.progressCircle) {
      this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      this.progressCircle.style.strokeDashoffset = '0';
    }

    this.initEvents();
  }

  initEvents() {
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.pause();
        } else {
          this.start();
        }
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }

    if (this.btnSub1) {
      this.btnSub1.addEventListener('click', () => this.adjustTime(-60));
    }
    if (this.btnAdd1) {
      this.btnAdd1.addEventListener('click', () => this.adjustTime(60));
    }
    if (this.btnAdd5) {
      this.btnAdd5.addEventListener('click', () => this.adjustTime(300));
    }
  }

  setDuration(minutes, label = '') {
    this.stop();
    this.totalSeconds = Math.max(minutes * 60, 60);
    this.remainingSeconds = this.totalSeconds;
    this.isPaused = false;

    if (this.subtextEl) {
      this.subtextEl.textContent = label || `${minutes} Min Timer`;
    }

    this.updateDisplay();
    this.enableControls(true);
    this.setStatus('Ready', false);
  }

  start() {
    if (this.remainingSeconds <= 0) return;

    this.isRunning = true;
    this.isPaused = false;
    this.updatePlayPauseButton();
    this.setStatus('Running', true);

    if (window.soundEngine) {
      window.soundEngine.playPop(600);
    }

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplay();

      if (this.remainingSeconds <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.timerInterval);
    this.updatePlayPauseButton();
    this.setStatus('Paused', false);

    if (window.soundEngine) {
      window.soundEngine.playPop(400);
    }
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.timerInterval);
    this.updatePlayPauseButton();
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
    this.setStatus('Ready', false);

    if (window.soundEngine) {
      window.soundEngine.playPop(500);
    }
  }

  adjustTime(secondsDelta) {
    this.remainingSeconds = Math.max(this.remainingSeconds + secondsDelta, 10);
    if (this.remainingSeconds > this.totalSeconds) {
      this.totalSeconds = this.remainingSeconds;
    }
    this.updateDisplay();

    if (window.soundEngine) {
      window.soundEngine.playPop(520);
    }
  }

  complete() {
    this.stop();
    this.setStatus('Time Up! ⏰', false);
    if (this.subtextEl) this.subtextEl.textContent = 'Screen time finished! 🎉';

    if (window.soundEngine) {
      window.soundEngine.playTimerAlarm();
      window.soundEngine.speak("Time's up! Great job enjoying your screen time!");
    }

    if (window.confettiEngine) {
      window.confettiEngine.explode(120);
    }

    document.title = '⏰ Time is up! - Kids TV Time Dice';
  }

  updateDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (this.digitsEl) {
      this.digitsEl.textContent = formatted;
    }

    if (this.progressCircle && this.totalSeconds > 0) {
      const progress = (this.totalSeconds - this.remainingSeconds) / this.totalSeconds;
      const offset = this.circumference * progress;
      this.progressCircle.style.strokeDashoffset = offset;

      // Color transition from emerald to amber to red as time runs low
      if (this.remainingSeconds <= 60) {
        this.progressCircle.style.stroke = '#ef4444';
      } else if (this.remainingSeconds <= 300) {
        this.progressCircle.style.stroke = '#f59e0b';
      } else {
        this.progressCircle.style.stroke = '#10b981';
      }
    }

    if (this.isRunning) {
      document.title = `(${formatted}) 📺 Kids TV Time`;
    }
  }

  updatePlayPauseButton() {
    if (!this.playPauseIcon || !this.playPauseText) return;

    if (this.isRunning) {
      this.playPauseIcon.textContent = '⏸️';
      this.playPauseText.textContent = 'Pause';
      this.playPauseBtn.className = 'btn btn-timer-ctrl btn-warning';
    } else {
      this.playPauseIcon.textContent = '▶️';
      this.playPauseText.textContent = this.isPaused ? 'Resume' : 'Start';
      this.playPauseBtn.className = 'btn btn-timer-ctrl btn-success';
    }
  }

  setStatus(text, isRunning) {
    if (this.statusDot) {
      this.statusDot.textContent = text;
      if (isRunning) {
        this.statusDot.classList.add('running');
      } else {
        this.statusDot.classList.remove('running');
      }
    }
  }

  enableControls(enabled) {
    const btns = [this.playPauseBtn, this.resetBtn, this.btnSub1, this.btnAdd1, this.btnAdd5];
    btns.forEach(btn => {
      if (btn) btn.disabled = !enabled;
    });
  }
}

window.screenTimer = new ScreenTimeTimer();
