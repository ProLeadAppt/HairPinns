// Sound effects for review funnel using Web Audio API

class SoundEffects {
  private audioContext: AudioContext | null = null;

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Subtle hover sound (soft beep)
  playHover() {
    try {
      const ctx = this.initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.log('Audio playback not available');
    }
  }

  // Click sound (higher pitch)
  playClick() {
    try {
      const ctx = this.initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (error) {
      console.log('Audio playback not available');
    }
  }

  // Success sound (major chord arpeggio)
  playSuccess() {
    try {
      const ctx = this.initAudioContext();
      const frequencies = [523.25, 659.25, 783.99]; // C-E-G major chord

      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.4);

        oscillator.start(ctx.currentTime + index * 0.1);
        oscillator.stop(ctx.currentTime + index * 0.1 + 0.4);
      });
    } catch (error) {
      console.log('Audio playback not available');
    }
  }

  // Celebration sound (ascending scale)
  playCelebration() {
    try {
      const ctx = this.initAudioContext();
      const scale = [523.25, 587.33, 659.25, 783.99, 880]; // C-D-E-G-A

      scale.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime + index * 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.08 + 0.3);

        oscillator.start(ctx.currentTime + index * 0.08);
        oscillator.stop(ctx.currentTime + index * 0.08 + 0.3);
      });
    } catch (error) {
      console.log('Audio playback not available');
    }
  }

  // Low sympathetic sound for negative feedback
  playSympathy() {
    try {
      const ctx = this.initAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(220, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.log('Audio playback not available');
    }
  }
}

export const soundEffects = new SoundEffects();
