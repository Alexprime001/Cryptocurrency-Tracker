
import { useState, useEffect } from 'react';
import { CryptoData, SortConfig } from '../types/crypto';
import { fetchCryptoData } from '../api/coingecko';
import { useToast } from '@/hooks/use-toast';

export const useCryptoData = () => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const newData = await fetchCryptoData();
      setData(newData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch crypto data');
      toast({
        title: "Error",
        description: "Failed to fetch cryptocurrency data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useSortedData = (data: CryptoData[], sortConfig: SortConfig) => {
  return [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    
    const compareResult = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? compareResult : -compareResult;
  });
};
