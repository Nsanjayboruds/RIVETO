import { useEffect, useCallback } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus within a container while `isActive` is true.
 */
export function useFocusTrap(isActive, containerRef) {
  useEffect(() => {
    if (!isActive || !containerRef?.current) return;

    const container = containerRef.current;

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}

/**
 * Calls `onEscape` when Escape is pressed while `isActive` is true.
 */
export function useEscapeKey(isActive, onEscape) {
  const handleEscape = useCallback(
    (event) => {
      if (event.key === 'Escape') onEscape();
    },
    [onEscape]
  );

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, handleEscape]);
}

/**
 * Arrow-key navigation for tablists, radiogroups, and similar controls.
 */
export function handleRovingKeyDown(
  event,
  items,
  currentIndex,
  onSelect,
  orientation = 'horizontal'
) {
  const isHorizontal = orientation === 'horizontal';
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

  let nextIndex = currentIndex;

  if (event.key === prevKey) {
    event.preventDefault();
    nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
  } else if (event.key === nextKey) {
    event.preventDefault();
    nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
  } else if (event.key === 'Home') {
    event.preventDefault();
    nextIndex = 0;
  } else if (event.key === 'End') {
    event.preventDefault();
    nextIndex = items.length - 1;
  } else {
    return;
  }

  onSelect(items[nextIndex], nextIndex);
  const focusTarget = document.getElementById(
    `roving-item-${items[nextIndex]}`
  );
  focusTarget?.focus();
}
