import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Check, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import GiftCard from '../components/GiftCard';
import GiftModal from '../components/GiftModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function GuestView() {
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGifts();
  }, []);

  useEffect(() => {
    filterGifts();
  }, [gifts, filter]);

  const fetchGifts = async () => {
    try {
      const response = await axios.get(`${API}/gifts`);
      setGifts(response.data);
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
      toast.error('Erro ao carregar presentes');
    } finally {
      setLoading(false);
    }
  };

  const filterGifts = () => {
    if (filter === 'available') {
      setFilteredGifts(gifts.filter(g => !g.is_selected));
    } else if (filter === 'selected') {
      setFilteredGifts(gifts.filter(g => g.is_selected));
    } else {
      setFilteredGifts(gifts);
    }
  };

  const handleSelectGift = (gift) => {
    if (gift.is_selected) {
      toast.error('Este presente já foi escolhido');
      return;
    }
    setSelectedGift(gift);
  };

  const handleConfirmSelection = async (selectionData) => {
    try {
      await axios.post(`${API}/gifts/${selectedGift.id}/select`, selectionData);
      toast.success('Presente selecionado com sucesso!', {
        description: 'Obrigado por participar!'
      });
      setSelectedGift(null);
      fetchGifts();
    } catch (error) {
      console.error('Erro ao selecionar presente:', error);
      toast.error(error.response?.data?.detail || 'Erro ao selecionar presente');
    }
  };

  const availableCount = gifts.filter(g => !g.is_selected).length;
  const selectedCount = gifts.filter(g => g.is_selected).length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-rose-50 via-stone-50 to-gold-50 py-20 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-8">
              <Heart className="w-10 h-10 text-gold-500" fill="currentColor" />
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-stone-800 mb-6">
              Chá de Cozinha
            </h1>
            
            <p className="font-body text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Escolha um presente especial para os noivos! Cada presente é único e só pode ser escolhido uma vez. 
              Selecione o seu favorito e deixe uma mensagem carinhosa.
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="bg-white rounded-full px-6 py-3 shadow-md">
                <span className="font-body text-sm text-stone-500 uppercase tracking-widest">Disponíveis</span>
                <span className="ml-2 font-heading text-2xl font-semibold text-gold-600">{availableCount}</span>
              </div>
              <div className="bg-white rounded-full px-6 py-3 shadow-md">
                <span className="font-body text-sm text-stone-500 uppercase tracking-widest">Escolhidos</span>
                <span className="ml-2 font-heading text-2xl font-semibold text-rose-500">{selectedCount}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filter Section */}
      <section className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-stone-500" />
              <span className="font-body text-sm text-stone-500 uppercase tracking-widest">Filtrar por</span>
            </div>
            
            <div className="flex gap-2">
              <button
                data-testid="filter-all-button"
                onClick={() => setFilter('all')}
                className={`rounded-full px-6 py-2 font-body font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todos ({gifts.length})
              </button>
              <button
                data-testid="filter-available-button"
                onClick={() => setFilter('available')}
                className={`rounded-full px-6 py-2 font-body font-medium transition-all duration-300 ${
                  filter === 'available'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Disponíveis ({availableCount})
              </button>
              <button
                data-testid="filter-selected-button"
                onClick={() => setFilter('selected')}
                className={`rounded-full px-6 py-2 font-body font-medium transition-all duration-300 ${
                  filter === 'selected'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Escolhidos ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gifts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-body text-stone-600">Carregando presentes...</p>
            </div>
          ) : filteredGifts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Gift className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="font-body text-xl text-stone-600">Nenhum presente encontrado</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGifts.map((gift, index) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  index={index}
                  onSelect={handleSelectGift}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gift Selection Modal */}
      <GiftModal
        gift={selectedGift}
        onClose={() => setSelectedGift(null)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
}
