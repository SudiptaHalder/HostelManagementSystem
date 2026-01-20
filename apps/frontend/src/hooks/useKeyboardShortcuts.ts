import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = !shortcut.ctrlKey || e.ctrlKey;
        const matchesMeta = !shortcut.metaKey || e.metaKey;
        const matchesShift = !shortcut.shiftKey || e.shiftKey;
        const matchesAlt = !shortcut.altKey || e.altKey;

        if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
