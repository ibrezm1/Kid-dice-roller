/**
 * Kids TV Time Dice Roller - Audio Engine
 * Uses Web Audio API for rich synthesized sound effects (100% offline & zero dependencies)
 * Plus Web Speech API for playful voice announcements
 */

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play subtle UI button pop
  playPop(freq = 480) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Play realistic dice rolling rattle sound
  playRollRattle() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Trigger multiple rapid clacks with random pitch
      const hits = 8;
      for (let i = 0; i < hits; i++) {
        const timeOffset = now + (i * 0.07) + (Math.random() * 0.03);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const baseFreq = 180 + Math.random() * 220;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, timeOffset);
        osc.frequency.exponentialRampToValueAtTime(60, timeOffset + 0.05);

        gain.gain.setValueAtTime(0.25 - (i * 0.02), timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(timeOffset);
        osc.stop(timeOffset + 0.06);
      }
    } catch (e) {
      console.warn('Audio rattle error:', e);
    }
  }

  // Play dice landing bounce thump
  playDiceThud() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn('Audio thud error:', e);
    }
  }

  // Play celebratory victory fanfare when dice stops
  playCelebrationFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio chords: C5, E5, G5, C6 (523.25, 659.25, 783.99, 1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.28, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (idx === notes.length - 1 ? 0.6 : 0.25));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + (idx === notes.length - 1 ? 0.65 : 0.26));
      });
    } catch (e) {
      console.warn('Audio fanfare error:', e);
    }
  }

  // Play timer finished chime
  playTimerAlarm() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const beeps = [880, 880, 1174.66, 1318.51];
      beeps.forEach((freq, i) => {
        const time = now + i * 0.18;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.32);
      });
    } catch (e) {
      console.warn('Alarm error:', e);
    }
  }

  // Speak announcement using Web Speech API
  speak(text) {
    if (!this.voiceEnabled) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly lively
      utterance.pitch = 1.3; // High playful tone for kids
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

window.soundEngine = new SoundEffectsEngine();
