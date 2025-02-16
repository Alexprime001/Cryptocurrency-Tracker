
import React, { useState, useEffect } from 'react';
import { CryptoData, SortConfig } from '../types/crypto';
import { useCryptoData, useSortedData } from '../hooks/useCryptoData';
import SearchBar from '../components/SearchBar';
import PriceDisplay from '../components/PriceDisplay';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap',
    direction: 'desc',
  });

  const { data, loading, error } = useCryptoData();
  
  useEffect(() => {
    const savedFavorites = localStorage.getItem('crypto_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('crypto_favorites', JSON.stringify(newFavorites));
  };

  const handleSort = (key: keyof CryptoData) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const filteredData = data.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = useSortedData(filteredData, sortConfig);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Cryptocurrency Tracker
        </h1>
        <p className="text-gray-600 mb-8">
          Track real-time cryptocurrency prices and market data
        </p>
        <div className="flex justify-center mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </header>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : (
        <PriceDisplay
          data={sortedData}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}
    </div>
  );
};

export default Index;
