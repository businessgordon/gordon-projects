import { useEffect, useState } from 'react';

export function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchFunction();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, dependencies);

  return { data, loading, error };
}
