import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useDebouncedWindowInnerHeight() {
  const [innerHeight, setInnerHeight] = useState(() => window.innerHeight);
  const debouncedSetInnerHeight = debounce(() => {
    setInnerHeight(window.innerHeight);
  }, 200);
  useEffect(() => {
    window.addEventListener('resize', debouncedSetInnerHeight);
    return () => {
      window.removeEventListener('resize', debouncedSetInnerHeight);
    };
  });
  return innerHeight;
}

export { usePrevious, useDebouncedWindowInnerHeight };
