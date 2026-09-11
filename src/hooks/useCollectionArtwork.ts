import { useEffect, useState } from 'react';
import { getCollectionArtwork, type CollectionArtwork } from '@/lib/collectionArtwork';

export function useCollectionArtwork(handles: string[]) {
  const [artwork, setArtwork] = useState<Record<string, CollectionArtwork>>({});
  const [loading, setLoading] = useState(true);
  const handleKey = JSON.stringify(handles);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getCollectionArtwork(JSON.parse(handleKey))
      .then(result => { if (active) setArtwork(result); })
      .catch(() => { if (active) setArtwork({}); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [handleKey]);
  return { artwork, loading };
}
