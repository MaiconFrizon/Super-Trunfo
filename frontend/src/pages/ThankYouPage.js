import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Monogram from '../components/Monogram';
import FloralCorner from '../components/FloralCorner';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const giftName = location.state?.giftName || 'Presente especial';

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-invite-ivory px-4 overflow-hidden">
      <FloralCorner position="tl" size={320} className="absolute -top-6 -left-6 opacity-90" />
      <FloralCorner position="tr" size={320} className="absolute -top-6 -right-6 opacity-90" />
      <FloralCorner position="bl" size={280} className="absolute -bottom-6 -left-6 opacity-75" />
      <FloralCorner position="br" size={280} className="absolute -bottom-6 -right-6 opacity-75" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-xl"
      >
        <Monogram size={84} className="mx-auto mb-6" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-invite-navy flex items-center justify-center shadow-lg"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="font-script text-5xl md:text-6xl text-invite-navy leading-none">Obrigado</h1>
        <div className="divider-flourish my-5"><span className="heart">♡</span></div>

        <p className="font-heading text-lg md:text-xl text-invite-ink/80 leading-relaxed italic">
          Seu presente foi reservado e sua mensagem chegará <br className="hidden md:inline" />
          direto no coração da Thalita e do Maicon.
        </p>

        <div className="mt-8 bg-white border border-invite-navy/10 rounded-2xl p-6 md:p-8 shadow-sm">
          <p className="font-body text-[11px] tracking-[0.24em] text-invite-gold-deep uppercase mb-2">Você escolheu</p>
          <p className="font-heading text-2xl md:text-3xl text-invite-navy font-medium">{giftName}</p>
          <p className="font-body text-sm text-invite-ink/60 mt-2">Reservado com carinho</p>
        </div>

        <p className="font-body text-sm text-invite-ink/65 mt-8">
          O casal vai entrar em contato para agradecer pessoalmente.
        </p>

        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="mt-10 inline-flex items-center gap-2 bg-invite-navy hover:bg-invite-blue text-white rounded-full px-8 py-4 font-body text-xs tracking-[0.2em] uppercase shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a lista
        </motion.button>

        <p className="font-script text-2xl text-invite-navy mt-10">Thalita &amp; Maicon</p>
      </motion.div>
    </div>
  );
}
