import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Check, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      
      // Redirecionar para Thank You Page com informações do presente
      setTimeout(() => {
        navigate('/obrigado', { state: { giftName: selectedGift.name } });
      }, 1000);
      
      toast.success('🎉 Presente reservado!', {
        description: 'Redirecionando...',
        duration: 2000
      });
      
      setSelectedGift(null);
      fetchGifts();
    } catch (error) {
      console.error('Erro ao selecionar presente:', error);
      toast.error('Ops! Algo deu errado', {
        description: error.response?.data?.detail || 'Tente novamente em alguns instantes',
        duration: 4000
      });
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
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg mb-6 md:mb-8"
            >
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-gold-500" fill="currentColor" />
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-stone-800 mb-6 md:mb-8">
              💛 Chá de Cozinha
            </h1>

            {/* Seção Conheça os Noivos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 md:mb-8"
            >
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold-400 to-rose-300 flex items-center justify-center text-white font-heading text-lg md:text-2xl font-bold shadow-lg"
                >
                  M
                </motion.div>
                <span className="font-heading text-2xl md:text-3xl text-stone-400">+</span>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose-300 to-gold-400 flex items-center justify-center text-white font-heading text-lg md:text-2xl font-bold shadow-lg"
                >
                  T
                </motion.div>
              </div>
              <p className="font-body text-base md:text-lg text-stone-600 font-medium">
                Maicon & Thalita estão construindo um lar cheio de amor
              </p>
            </motion.div>
            
            {/* Copy Desktop */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block font-body text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-6"
            >
              Você foi convidado para fazer parte de um momento muito especial! 
              Aqui você pode escolher um presente com carinho para ajudar o casal 
              a começar essa nova jornada.
            </motion.p>

            {/* Copy Mobile - Compacto */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="md:hidden font-body text-base text-stone-600 leading-relaxed px-4 mb-4"
            >
              Escolha um presente com carinho para o casal 💛
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden md:block font-body text-base text-stone-500 mb-8"
            >
              Sem pressa, explore com calma 😊
            </motion.p>

            {/* Momento de Pausa Emocional - Apenas Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden md:block max-w-xl mx-auto mb-8"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gold-100/50">
                <p className="font-body text-base text-center text-stone-700 leading-loose">
                  Este é um momento especial. Não há pressa. 
                  Explore com calma, escolha aquele presente que fala 
                  ao seu coração, e saiba que sua participação significa muito 
                  para o Maicon e a Thalita 💛
                </p>
              </div>
            </motion.div>

            {/* Badge Mobile - Compacto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="md:hidden inline-flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-full px-4 py-2 mb-6 text-sm"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="text-xl"
              >
                ✨
              </motion.span>
              <span className="font-body text-xs text-gold-800">
                {availableCount} {availableCount === 1 ? 'presente esperando' : 'presentes esperando'} por você
              </span>
            </motion.div>

            {/* Badge Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="hidden md:inline-flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-full px-6 py-2 mb-8"
            >
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl"
              >
                ✨
              </motion.span>
              <span className="font-body text-sm text-gold-800">
                Já escolheu? Sua mensagem vai emocionar o casal
              </span>
            </motion.div>

            {/* Stats Badges - Desktop apenas */}
            <div className="hidden md:flex flex-wrap gap-4 justify-center items-center">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="bg-white rounded-full px-6 py-3 shadow-md"
              >
                <span className="font-body text-sm text-stone-500 uppercase tracking-widest">✨ Esperando por você</span>
                <span className="ml-2 font-heading text-2xl font-semibold text-gold-600">{availableCount}</span>
              </motion.div>
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                className="bg-white rounded-full px-6 py-3 shadow-md"
              >
                <span className="font-body text-sm text-stone-500 uppercase tracking-widest">💝 Já com um lar</span>
                <span className="ml-2 font-heading text-2xl font-semibold text-rose-500">{selectedCount}</span>
              </motion.div>
            </div>

            {/* Seta - Desktop apenas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="hidden md:block mt-8"
            >
              <p className="font-body text-sm text-stone-400 flex items-center justify-center gap-2">
                <span>👇</span>
                <span>Comece explorando os presentes abaixo</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Versão Mobile - Accordion Compacto */}
          <div className="md:hidden">
            <details className="group">
              <summary className="flex items-center justify-center gap-2 cursor-pointer py-3 text-sm font-body text-gold-600 hover:text-gold-700">
                <span>Como funciona?</span>
                <motion.span
                  className="text-lg group-open:rotate-180 transition-transform"
                >
                  💡
                </motion.span>
              </summary>
              <div className="mt-4 text-center">
                <ol className="text-sm text-stone-600 space-y-2 inline-block text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-600 font-semibold">1.</span>
                    <span>Veja os presentes disponíveis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-semibold">2.</span>
                    <span>Escolha aquele que toca o coração</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-600 font-semibold">3.</span>
                    <span>Deixe uma mensagem carinhosa</span>
                  </li>
                </ol>
              </div>
            </details>
          </div>

          {/* Versão Desktop - Cards Completos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden md:block bg-gradient-to-br from-white via-stone-50/30 to-gold-50/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100"
          >
            <h3 className="font-heading text-2xl md:text-3xl text-center text-stone-800 mb-3 font-semibold">
              Como funciona? É super simples 🌟
            </h3>
            <p className="font-body text-sm text-center text-stone-500 mb-10">
              Relaxe e aproveite o momento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                >
                  <span className="text-3xl">👀</span>
                </motion.div>
                <div className="mb-2">
                  <span className="font-body text-xs uppercase tracking-wider text-stone-400">Passo 1</span>
                </div>
                <p className="font-body text-base text-stone-700 leading-relaxed">
                  <strong className="text-gold-600">Explore</strong> os presentes disponíveis com calma
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                >
                  <span className="text-3xl">💖</span>
                </motion.div>
                <div className="mb-2">
                  <span className="font-body text-xs uppercase tracking-wider text-stone-400">Passo 2</span>
                </div>
                <p className="font-body text-base text-stone-700 leading-relaxed">
                  <strong className="text-rose-600">Escolha</strong> aquele que toca o seu coração
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-gold-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                >
                  <span className="text-3xl">✍️</span>
                </motion.div>
                <div className="mb-2">
                  <span className="font-body text-xs uppercase tracking-wider text-stone-400">Passo 3</span>
                </div>
                <p className="font-body text-base text-stone-700 leading-relaxed">
                  <strong className="text-gold-600">Deixe</strong> uma mensagem que vai emocionar
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gold-50/50 rounded-full px-4 py-2 border border-gold-100">
                <span className="text-lg">💡</span>
                <p className="font-body text-xs text-stone-600">
                  Cada presente só pode ser escolhido uma vez
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Prova Social */}
      {selectedCount > 0 && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="font-body text-sm text-stone-600 flex items-center justify-center gap-2">
                <span className="text-lg">💕</span>
                <span>
                  <strong className="text-rose-600">{selectedCount}</strong> {selectedCount === 1 ? 'pessoa já participou' : 'pessoas já participaram'} com carinho
                </span>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filter Section */}
      <section className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-stone-500" />
              <span className="font-body text-sm text-stone-500 uppercase tracking-widest">Filtrar por</span>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                data-testid="filter-all-button"
                onClick={() => setFilter('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-6 py-2 font-body font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Ver todos 💛
              </motion.button>
              <motion.button
                data-testid="filter-available-button"
                onClick={() => setFilter('available')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-6 py-2 font-body font-medium transition-all duration-300 ${
                  filter === 'available'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>Esperando por você</span>
                  <span className="text-xs">✨ {availableCount}</span>
                </span>
              </motion.button>
              <motion.button
                data-testid="filter-selected-button"
                onClick={() => setFilter('selected')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-6 py-2 font-body font-medium transition-all duration-300 ${
                  filter === 'selected'
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>Já com um lar</span>
                  <span className="text-xs">💝 {selectedCount}</span>
                </span>
              </motion.button>
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
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Gift className="w-16 h-16 text-gold-300 mx-auto mb-4" />
              </motion.div>
              
              {filter === 'available' && availableCount === 0 ? (
                <>
                  <p className="font-heading text-2xl text-stone-800 mb-3">💛 Uau! Todos os presentes já foram escolhidos</p>
                  <p className="font-body text-base text-stone-600 max-w-md mx-auto leading-relaxed">
                    Que momento lindo de ver! Obrigado por estar aqui.
                    O Maicon e a Thalita vão ficar muito felizes em saber 
                    que você veio celebrar junto com eles 🙏
                  </p>
                </>
              ) : filter === 'selected' && selectedCount === 0 ? (
                <>
                  <p className="font-heading text-2xl text-stone-800 mb-3">✨ Seja a primeira pessoa a escolher um presente!</p>
                  <p className="font-body text-base text-stone-600 max-w-md mx-auto leading-relaxed">
                    Os noivos estão ansiosos para ver as primeiras escolhas.
                    Explore com calma e siga seu coração 💛
                  </p>
                </>
              ) : (
                <>
                  <p className="font-body text-xl text-stone-600 mb-2">🎁 Nenhum presente neste filtro</p>
                  <p className="font-body text-sm text-stone-500">Tente mudar o filtro acima!</p>
                </>
              )}
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

      {/* Footer with Admin Link */}
      <footer className="bg-gradient-to-br from-rose-50 via-stone-50 to-gold-50 py-16 border-t border-gold-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Heart className="w-10 h-10 text-gold-500 mx-auto mb-6" fill="currentColor" />
            </motion.div>
            
            <h3 className="font-heading text-3xl text-stone-800 font-semibold mb-4">
              Obrigado por estar aqui 💛
            </h3>
            
            <p className="font-body text-lg text-stone-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              Sua presença e carinho fazem toda a diferença neste momento especial.
              Maicon e Thalita agradecem de coração.
            </p>
            
            <div className="mb-6">
              <p className="font-body text-sm text-stone-500 italic">
                Com amor, Maicon & Thalita 🙏
              </p>
            </div>

            <div className="pt-6 border-t border-stone-200/50">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 font-body text-xs text-stone-400 hover:text-gold-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Acesso Administrativo
              </a>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Gift Selection Modal */}
      <GiftModal
        gift={selectedGift}
        onClose={() => setSelectedGift(null)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
}
