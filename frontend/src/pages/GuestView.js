import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Filter, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import GiftCard from '../components/GiftCard';
import GiftModal from '../components/GiftModal';
import Monogram from '../components/Monogram';
import FloralCorner from '../components/FloralCorner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Top-navigation labels matching the invitation website reference
const NAV_ITEMS = [
  { label: 'HOME', href: '#top' },
  { label: 'SOBRE NÓS', href: '#sobre' },
  { label: 'LISTA DE PRESENTES', href: '#presentes' }
];
const NAV_ITEMS_RIGHT = [
  { label: 'COMO FUNCIONA', href: '#como-funciona' },
  { label: 'CONFIRMAÇÃO', href: '#confirmacao' },
  { label: 'CONTATO', href: '#contato' }
];

export default function GuestView() {
  const [gifts, setGifts] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchGifts(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { filterGifts(); }, [gifts, filter]);

  const fetchGifts = async () => {
    try {
      const response = await axios.get(`${API}/gifts`);
      setGifts(response.data);
    } catch {
      toast.error('Erro ao carregar presentes');
    } finally {
      setLoading(false);
    }
  };

  const filterGifts = () => {
    if (filter === 'available') setFilteredGifts(gifts.filter(g => !g.is_selected));
    else if (filter === 'selected') setFilteredGifts(gifts.filter(g => g.is_selected));
    else setFilteredGifts(gifts);
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
      setTimeout(() => {
        navigate('/obrigado', { state: { giftName: selectedGift.name } });
      }, 1000);
      toast.success('Presente reservado!', { description: 'Redirecionando...', duration: 2000 });
      setSelectedGift(null);
      fetchGifts();
    } catch (error) {
      toast.error('Ops! Algo deu errado', {
        description: error.response?.data?.detail || 'Tente novamente em alguns instantes',
        duration: 4000
      });
    }
  };

  const availableCount = gifts.filter(g => !g.is_selected).length;
  const selectedCount = gifts.filter(g => g.is_selected).length;

  const scrollToList = () => {
    const el = document.getElementById('presentes');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-invite-ivory text-invite-ink" id="top">
      {/* ================= TOP NAV ================= */}
      <header className="sticky top-0 z-40 bg-invite-ivory/90 backdrop-blur-sm border-b border-invite-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center py-3">
            {/* Left nav */}
            <nav className="flex items-center gap-7 text-xs tracking-[0.18em] text-invite-navy font-body">
              {NAV_ITEMS.map(n => (
                <a key={n.label} href={n.href} className="hover:text-invite-gold-deep transition-colors">{n.label}</a>
              ))}
            </nav>
            {/* Center monogram */}
            <a href="#top" aria-label="Início" className="mx-6">
              <Monogram size={72} />
            </a>
            {/* Right nav */}
            <nav className="flex items-center gap-7 justify-end text-xs tracking-[0.18em] text-invite-navy font-body">
              {NAV_ITEMS_RIGHT.map(n => (
                <a key={n.label} href={n.href} className="hover:text-invite-gold-deep transition-colors">{n.label}</a>
              ))}
              <a href="/admin" aria-label="Área administrativa" className="ml-2 text-invite-navy/70 hover:text-invite-navy">
                <ShoppingBag className="w-5 h-5" />
              </a>
            </nav>
          </div>
          {/* Mobile nav — simplified */}
          <div className="md:hidden flex items-center justify-between py-3">
            <a href="#presentes" className="font-body text-[11px] tracking-[0.16em] text-invite-navy">PRESENTES</a>
            <Monogram size={48} />
            <a href="#como-funciona" className="font-body text-[11px] tracking-[0.16em] text-invite-navy">COMO FUNCIONA</a>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-invite-ivory">
        {/* Floral corners */}
        <FloralCorner position="tl" size={320} className="absolute -top-6 -left-6 opacity-95" />
        <FloralCorner position="tr" size={320} className="absolute -top-6 -right-6 opacity-95" />
        <FloralCorner position="bl" size={280} className="absolute -bottom-6 -left-6 opacity-70 hidden md:block" />
        <FloralCorner position="br" size={280} className="absolute -bottom-6 -right-6 opacity-70 hidden md:block" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Monogram size={200} className="mx-auto mb-6 md:mb-8" />

            {/* Couple names — elegant script */}
            <h1 className="font-script text-invite-navy leading-[0.9] text-[3.2rem] sm:text-7xl md:text-[6.5rem] tracking-wide">
              Thalita <span className="text-invite-gold">&amp;</span> Maicon
            </h1>

            {/* Gold flourish divider */}
            <div className="divider-flourish my-6 md:my-8">
              <span className="heart">♡</span>
            </div>

            {/* Bible verse — serif */}
            <blockquote className="font-heading text-base md:text-lg leading-relaxed text-invite-ink/85 max-w-2xl mx-auto">
              <span className="italic">
                Assim, permanecem agora estes três: <br className="hidden md:inline" />
                a fé, a esperança e o amor. O maior deles, porém, é o amor.
              </span>
              <cite className="block not-italic font-body text-xs md:text-sm tracking-[0.18em] text-invite-navy/70 mt-3">
                1 CORÍNTIOS 13:13
              </cite>
            </blockquote>

            {/* CTA — soft blue */}
            <motion.button
              data-testid="hero-view-gifts-btn"
              onClick={scrollToList}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10 md:mt-12 inline-flex items-center gap-3 bg-invite-navy hover:bg-invite-blue text-white rounded-full px-10 py-4 font-body text-sm tracking-[0.18em] uppercase transition-all shadow-[0_10px_30px_-12px_rgba(52,78,138,0.45)] hover:shadow-[0_18px_36px_-10px_rgba(52,78,138,0.5)]"
            >
              <Gift className="w-4 h-4" />
              Ver Presentes
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ================= INFO HIGHLIGHTS ================= */}
      <section id="como-funciona" className="bg-white border-y border-invite-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-invite-navy/10">
            {[
              { icon: <Gift className="w-6 h-6" />, title: 'Escolha o presente', sub: 'Com carinho' },
              { icon: <Heart className="w-6 h-6" />, title: 'Deixe sua mensagem', sub: 'Para os noivos' },
              { icon: <SendIcon />, title: 'Confirme sua escolha', sub: 'É rapidinho!' },
              { icon: <LockIcon />, title: 'Ambiente seguro', sub: 'Seus dados protegidos' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-3 md:gap-4 px-3 md:px-6 text-center md:text-left">
                <div className="text-invite-navy">{item.icon}</div>
                <div>
                  <p className="font-heading text-base md:text-lg text-invite-navy font-medium leading-tight">{item.title}</p>
                  <p className="font-body text-xs md:text-sm text-invite-ink/60 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GIFT LIST ================= */}
      <section id="presentes" className="py-16 md:py-24 bg-invite-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-invite-gold-deep uppercase mb-3">Lista de Presentes</p>
            <h2 className="font-heading text-3xl md:text-5xl text-invite-navy font-medium">Escolha seu presente</h2>
            <div className="divider-flourish mt-5"><span className="heart">♡</span></div>
          </div>

          {/* Filter pills — desktop only, softer style */}
          <div className="hidden md:flex items-center justify-center gap-2 mb-10">
            <Filter className="w-4 h-4 text-invite-navy/50 mr-2" />
            {[
              { key: 'all', label: `Todos • ${gifts.length}` },
              { key: 'available', label: `Disponíveis • ${availableCount}` },
              { key: 'selected', label: `Já escolhidos • ${selectedCount}` }
            ].map(f => (
              <button
                key={f.key}
                data-testid={`filter-${f.key}-button`}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase transition-all ${
                  filter === f.key
                    ? 'bg-invite-navy text-white shadow-md'
                    : 'bg-white text-invite-navy border border-invite-navy/15 hover:border-invite-navy/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-2 border-invite-navy border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-body text-invite-ink/60">Carregando presentes...</p>
            </div>
          ) : filteredGifts.length === 0 ? (
            <div className="text-center py-20">
              <Gift className="w-14 h-14 text-invite-navy/30 mx-auto mb-4" />
              <p className="font-heading text-2xl text-invite-navy mb-2">Nenhum presente neste filtro</p>
              <p className="font-body text-sm text-invite-ink/60">Tente mudar o filtro acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredGifts.map((gift, index) => (
                <GiftCard key={gift.id} gift={gift} index={index} onSelect={handleSelectGift} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="contato" className="relative bg-white border-t border-invite-navy/10">
        <FloralCorner position="bl" size={240} className="absolute -bottom-4 -left-4 opacity-80" />
        <FloralCorner position="br" size={240} className="absolute -bottom-4 -right-4 opacity-80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <div className="divider-flourish mb-6"><span className="heart">♡</span></div>
          <h3 className="font-heading text-3xl md:text-4xl text-invite-navy mb-4">Obrigado por estar aqui</h3>
          <p className="font-body text-base md:text-lg text-invite-ink/75 leading-relaxed max-w-2xl mx-auto">
            Sua presença e carinho fazem toda a diferença neste momento especial.
            <br className="hidden md:inline" /> Thalita e Maicon agradecem de coração.
          </p>
          <p className="font-script text-3xl md:text-4xl text-invite-navy mt-6">Thalita &amp; Maicon</p>

          <div className="mt-10 pt-6 border-t border-invite-navy/10">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 font-body text-xs tracking-[0.16em] uppercase text-invite-navy/50 hover:text-invite-navy transition-colors"
            >
              Acesso Administrativo
            </a>
          </div>
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

// Minimal inline icon glyphs to avoid any extra imports
function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
