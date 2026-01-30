import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const giftName = location.state?.giftName || 'Presente especial';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-stone-50 to-gold-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        {/* Confetti Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ 
            duration: 1,
            repeat: 2,
            ease: "easeInOut"
          }}
          className="text-8xl mb-8"
        >
          🎉
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-4xl md:text-5xl font-bold text-stone-800 mb-6"
        >
          Que lindo gesto! 💛
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-body text-lg md:text-xl text-stone-600 leading-relaxed mb-8"
        >
          Seu presente foi reservado e sua mensagem chegará 
          direto no coração do Maicon e da Thalita.
        </motion.p>
        
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="bg-white rounded-3xl p-8 shadow-2xl shadow-gold-200/20 mb-10 border border-stone-100"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-gold-500" fill="currentColor" />
            <p className="font-body text-sm text-stone-500 uppercase tracking-widest">
              Você escolheu
            </p>
          </div>
          <p className="font-heading text-2xl md:text-3xl text-gold-600 font-semibold mb-3">
            {giftName}
          </p>
          <div className="flex items-center justify-center gap-2 text-rose-500">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💝
            </motion.div>
            <span className="font-body text-sm">Reservado com carinho</span>
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-base text-stone-600 mb-4"
        >
          O casal vai entrar em contato para agradecer pessoalmente 🙏
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-body text-sm text-stone-500 mb-10"
        >
          Obrigado por fazer parte desse momento especial
        </motion.p>
        
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gold-500 hover:bg-gold-600 text-white rounded-full px-8 py-4 font-body font-bold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para a lista</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <p className="font-body text-xs text-stone-400">
            ✨ Compartilhe esse momento nas redes sociais
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
