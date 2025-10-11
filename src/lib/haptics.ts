// Haptic feedback utilities for mobile devices

class Haptics {
  // Check if vibration API is supported
  isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  // Light tap (selection)
  light() {
    if (this.isSupported()) {
      navigator.vibrate(10);
    }
  }

  // Medium impact (button press)
  medium() {
    if (this.isSupported()) {
      navigator.vibrate(20);
    }
  }

  // Heavy impact (important action)
  heavy() {
    if (this.isSupported()) {
      navigator.vibrate(40);
    }
  }

  // Success pattern
  success() {
    if (this.isSupported()) {
      navigator.vibrate([10, 50, 10, 50, 10]);
    }
  }

  // Error pattern
  error() {
    if (this.isSupported()) {
      navigator.vibrate([50, 100, 50]);
    }
  }

  // Notification pattern
  notification() {
    if (this.isSupported()) {
      navigator.vibrate([30, 50, 30]);
    }
  }
}

export const haptics = new Haptics();
