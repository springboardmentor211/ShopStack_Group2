import { useCallback, useEffect, useRef, useState } from 'react';

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Set());
  const counter = useRef(0);

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((t) => clearTimeout(t));
  }, []);

  const push = useCallback((message, kind = 'ok') => {
    counter.current += 1;
    const id = counter.current;
    setToasts((list) => [...list, { id, message, kind }]);
    const timer = setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      timers.current.delete(timer);
    }, 4200);
    timers.current.add(timer);
  }, []);

  return { toasts, push };
}
