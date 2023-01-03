import { useEffect, useState } from 'react';

export default function useVerseName() {
  const [verse, serVerse] = useState(() => {
    const verseNameValue = localStorage.getItem('verse');
    return verseNameValue || '';
  });

  useEffect(() => {
    localStorage.setItem('verse', verse);
  }, [verse]);

  return [verse, serVerse];
}
