import { useEffect, useState } from 'react';

export default function useVerseName() {
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    const currentVerse = localStorage.getItem('verse');
    setVerse(currentVerse);
  }, [verse]);

  useEffect(() => {
    localStorage.setItem('verse', verse);
  }, [verse]);

  return [verse, setVerse];
}
