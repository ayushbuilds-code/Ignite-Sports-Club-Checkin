import confetti from 'canvas-confetti';

/**
 * Triggers esports celebratory confetti burst
 */
export function triggerCheckInConfetti(): void {
  try {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#a855f7', '#22c55e', '#06b6d4', '#e2e8f0', '#ec4899'],
    });
  } catch {
    // Canvas confetti gracefully falls back
  }
}

/**
 * Synthesizes a clean sci-fi/esports check-in chime using browser Web Audio API
 * No external sound files or network requests required.
 */
export function playCheckInAudioChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Sci-fi high-tech chime notes: E5 (659.25Hz) -> G5 (783.99Hz) -> B5 (987.77Hz)
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.18);

    osc2.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.18);

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.36);
    osc2.stop(ctx.currentTime + 0.36);
  } catch {
    // Ignore audio autoplay restrictions if user hasn't interacted
  }
}
