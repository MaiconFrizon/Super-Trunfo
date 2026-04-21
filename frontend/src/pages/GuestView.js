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
import ContactSection from '../components/ContactSection';

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
          {/* Mobile nav — simplified (shorter letter-spacing to fit 320px) */}
          <div className="md:hidden flex items-center justify-between py-3">
            <a href="#presentes" className="font-body text-[10px] tracking-[0.12em] text-invite-navy whitespace-nowrap">PRESENTES</a>
            <Monogram size={48} />
            <a href="#contato" className="font-body text-[10px] tracking-[0.12em] text-invite-navy whitespace-nowrap">CONTATO</a>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-invite-ivory">
        {/* Floral corners */}
        <FloralCorner position="tl" size={420} className="absolute -top-10 -left-10 opacity-95" />
        <FloralCorner position="tr" size={420} className="absolute -top-10 -right-10 opacity-95" />
        <FloralCorner position="bl" size={340} className="absolute -bottom-10 -left-10 opacity-85 hidden md:block" />
        <FloralCorner position="br" size={340} className="absolute -bottom-10 -right-10 opacity-85 hidden md:block" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Monogram size={110} className="mx-auto mb-8 md:mb-10" />

            {/* Couple names — elegant script, all navy */}
            <h1 className="font-script text-invite-navy leading-[0.95] text-[2.5rem] xs:text-[3rem] sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] tracking-wide break-words">
              Thalita <span>&amp;</span> Maicon
            </h1>

            {/* Gold flourish divider with heart */}
            <div className="divider-flourish my-5 md:my-7">
              <span className="heart">♡</span>
            </div>

            {/* Bible verse — serif, centered */}
            <blockquote className="font-heading text-base md:text-[1.15rem] leading-relaxed text-invite-ink/80 max-w-2xl mx-auto">
              Assim, permanecem agora estes três: <br />
              a fé, a esperança e o amor. O maior deles, porém, é o amor.
              <cite className="block not-italic font-heading italic text-invite-navy/85 text-base md:text-lg mt-3">
                1 Coríntios 13:13
              </cite>
            </blockquote>

            {/* CTA — soft blue */}
            <motion.button
              data-testid="hero-view-gifts-btn"
              onClick={scrollToList}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 md:mt-10 inline-flex items-center gap-3 bg-invite-navy hover:bg-invite-blue text-white rounded-full px-12 py-4 font-body text-sm tracking-[0.22em] uppercase transition-all shadow-[0_10px_30px_-12px_rgba(52,78,138,0.45)] hover:shadow-[0_18px_36px_-10px_rgba(52,78,138,0.5)]"
            >
              <Gift className="w-4 h-4" />
              Ver Presentes
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ================= INFO HIGHLIGHTS ================= */}
      <section id="como-funciona" className="bg-white border-y border-invite-navy/10 scroll-mt-20">
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
      <section id="presentes" className="py-16 md:py-24 bg-invite-ivory scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="divider-flourish mb-4"><span className="heart">♡</span></div>
            <h2 className="font-heading text-3xl md:text-5xl text-invite-navy font-medium tracking-[0.2em] uppercase">Escolha seu Presente</h2>
            <svg className="mx-auto mt-5" width="180" height="14" viewBox="0 0 180 14" fill="none" aria-hidden="true">
              {/* Left mirrored S-curve */}
              <path d="M4 7 C 22 -3, 44 17, 62 7 C 76 0, 86 4, 90 7"
                    stroke="#C0A971" strokeWidth="1.1" strokeLinecap="round" fill="none" />
              {/* Right mirrored S-curve */}
              <path d="M176 7 C 158 -3, 136 17, 118 7 C 104 0, 94 4, 90 7"
                    stroke="#C0A971" strokeWidth="1.1" strokeLinecap="round" fill="none" />
              {/* Center diamond ornament */}
              <path d="M90 2 L 94 7 L 90 12 L 86 7 Z" fill="#C0A971" />
            </svg>
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

      {/* ================= MENSAGEM AOS NOIVOS ================= */}
      <section id="confirmacao" className="bg-white border-t border-invite-navy/10 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <div className="w-14 h-14 mx-auto mb-4 relative">
            {/* Envelope — navy outline */}
            <svg viewBox="0 0 24 24" className="w-full h-full text-invite-navy" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            {/* Small gold heart stamp overlay */}
            <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto w-4 h-4 text-invite-gold" fill="currentColor" aria-hidden="true"
                 style={{ top: '55%', transform: 'translateY(-50%)' }}>
              <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl text-invite-navy font-medium tracking-wider uppercase">
            Deixe uma mensagem para os noivos
          </h2>
          <p className="font-body text-sm md:text-base text-invite-ink/65 mt-2">
            Seu carinho ficará guardado para sempre!
          </p>
          <button
            onClick={scrollToList}
            className="mt-6 inline-flex items-center gap-2 bg-invite-navy hover:bg-invite-blue text-white rounded-full px-10 py-3.5 font-body text-xs tracking-[0.22em] uppercase transition-all shadow-[0_8px_24px_-10px_rgba(52,78,138,0.45)]"
            data-testid="leave-message-btn"
          >
            Deixar Mensagem
          </button>
        </div>
      </section>

      {/* ================= CONTACT (WhatsApp) ================= */}
      <ContactSection />

      {/* ================= FOOTER ================= */}
      <footer id="rodape" className="relative bg-invite-ivory-soft border-t border-invite-navy/10 overflow-hidden">
        <FloralCorner position="bl" size={260} className="absolute -bottom-6 -left-6 opacity-85" />
        <FloralCorner position="br" size={260} className="absolute -bottom-6 -right-6 opacity-85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 text-center">
          <Monogram size={84} className="mx-auto mb-3" />
          <p className="font-script text-3xl md:text-4xl text-invite-navy">Thalita &amp; Maicon</p>
          <p className="font-body text-xs md:text-sm text-invite-ink/55 mt-6 tracking-wide">
            © {new Date().getFullYear()} Thalita &amp; Maicon. Todos os direitos reservados.
          </p>

          <div className="mt-4">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-invite-navy/35 hover:text-invite-navy transition-colors"
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
