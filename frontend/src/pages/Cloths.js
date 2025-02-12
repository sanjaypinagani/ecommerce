import { useState, useEffect, useCallback } from "react";
import ItemList from '../components/ItemList';
import _debounce from 'lodash/debounce';

function Cloths() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/items/cloths?page=${page}&limit=2`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setItems(prevItems => [...prevItems, ...json]);
      setHasMore(json.length > 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleScroll = useCallback(
    _debounce(() => {
      if (loading || !hasMore) return;

      const threshold = 100;
      const isNearBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - threshold;

      if (isNearBottom) {
        setPage(prevPage => prevPage + 1);
        console.log(page)
      }
    }, 1), [loading, hasMore]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="container">
      {error && <h1>{error}</h1>}
      {!items.length && !error && <h1>Loading...</h1>}
      {items.map((item, index) => (
        <ItemList key={index} item={item} id='cloths'/>
      ))}
      {items.length &&loading && <h1>Loading more items...</h1>}
    </div>
  );
}

export default Cloths;
