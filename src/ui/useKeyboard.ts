import { useEffect } from 'react';

interface KeyboardHandlers {
  onPrev: () => void;
  onNext: () => void;
  onCommit: () => void;
  onUndo: () => void;
  /** True while a modal/confirm is open — arrows/commit are suppressed. */
  suspended: boolean;
}

/** Global keyboard wiring: arrows highlight, Enter commits, Backspace undoes. */
export function useKeyboard({
  onPrev,
  onNext,
  onCommit,
  onUndo,
  suspended,
}: KeyboardHandlers) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (suspended) return;
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          onNext();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onCommit();
          break;
        case 'Backspace':
          e.preventDefault();
          onUndo();
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPrev, onNext, onCommit, onUndo, suspended]);
}
