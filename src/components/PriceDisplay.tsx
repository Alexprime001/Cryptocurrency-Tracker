
import React, { useState, useEffect } from 'react';
import { CryptoData, SortConfig } from '../types/crypto';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PriceDisplayProps {
  data: CryptoData[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof CryptoData) => void;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  data,
  favorites,
  onToggleFavorite,
  sortConfig,
  onSort,
}) => {
  const [priceAnimations, setPriceAnimations] = useState<Record<string, string>>({});

  useEffect(() => {
    const newAnimations: Record<string, string> = {};
    data.forEach((coin) => {
      const prevPrice = parseFloat(localStorage.getItem(`price_${coin.id}`) || '0');
      if (prevPrice && prevPrice !== coin.current_price) {
        newAnimations[coin.id] = prevPrice < coin.current_price ? 'animate-price-up' : 'animate-price-down';
        localStorage.setItem(`price_${coin.id}`, coin.current_price.toString());
      }
    });
    setPriceAnimations(newAnimations);
  }, [data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    return percent?.toFixed(2) + '%';
  };

  return (
    <Card className="w-full overflow-hidden glass-card animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('current_price')}>
                Price
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('price_change_percentage_24h')}>
                24h Change
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('market_cap')}>
                Market Cap
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((coin) => (
              <TableRow key={coin.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <button
                    onClick={() => onToggleFavorite(coin.id)}
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <Star
                      size={18}
                      fill={favorites.includes(coin.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-sm text-gray-500 uppercase">{coin.symbol}</span>
                </TableCell>
                <TableCell className={priceAnimations[coin.id]}>
                  {formatPrice(coin.current_price)}
                </TableCell>
                <TableCell
                  className={`${
                    coin.price_change_percentage_24h > 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {formatPercent(coin.price_change_percentage_24h)}
                </TableCell>
                <TableCell>
                  {formatPrice(coin.market_cap)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default PriceDisplay;
