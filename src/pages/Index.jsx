import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, ArrowUpDown } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Index = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get('https://api.coincap.io/v2/assets?limit=100');
        setCryptos(response.data.data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos
    .filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const changeA = parseFloat(a.changePercent24Hr);
      const changeB = parseFloat(b.changePercent24Hr);
      return sortOrder === 'asc' ? changeA - changeB : changeB - changeA;
    });

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Input
        type="text"
        placeholder="Hack the crypto search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 bg-secondary text-primary placeholder-primary/50 hacker-border"
      />
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="text-primary">Rank</TableHead>
              <TableHead className="text-primary">Name</TableHead>
              <TableHead className="text-primary">Symbol</TableHead>
              <TableHead className="text-primary">Price (USD)</TableHead>
              <TableHead className="text-primary">Market Cap (USD)</TableHead>
              <TableHead className="text-primary">
                24h Change
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="ml-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-primary">Favorite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCryptos.map((crypto) => (
              <TableRow key={crypto.id} className="hover:bg-secondary/50 transition-colors">
                <Link to={`/asset/${crypto.id}`} className="contents">
                  <TableCell className="font-medium">{crypto.rank}</TableCell>
                  <TableCell>{crypto.name}</TableCell>
                  <TableCell className="text-accent">{crypto.symbol}</TableCell>
                  <TableCell>${parseFloat(crypto.priceUsd).toFixed(2)}</TableCell>
                  <TableCell>${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B</TableCell>
                  <TableCell className={parseFloat(crypto.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
                  </TableCell>
                </Link>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(crypto.id);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        favorites.includes(crypto.id) ? 'fill-yellow-500 text-yellow-500' : 'text-primary'
                      }`}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Index;
