import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';

// BRL price formatter
const fmtBRL = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function GiftCard({ gift, index, onSelect }) {
  const [liked, setLiked] = useState(false);
  const price = fmtBRL(gift.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.05, 0.35), duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="bg-white rounded-xl overflow-hidden border border-invite-navy/10 shadow-[0_1px_2px_rgba(52,78,138,0.04)] hover:shadow-[0_18px_40px_-18px_rgba(52,78,138,0.25)] transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-invite-blue-mist/40">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8 }}
            src={gift.image_url}
            alt={gift.name}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop'; }}
            className="w-full h-full object-cover"
          />

          {/* Heart favorite (decorative) */}
          {!gift.is_selected && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
              aria-label={liked ? 'Remover favorito' : 'Favoritar presente'}
              data-testid={`favorite-gift-${gift.id}`}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-invite-navy hover:text-invite-gold transition-colors shadow-sm"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-invite-gold text-invite-gold' : ''}`} />
            </button>
          )}

          {gift.is_selected && (
            <div className="absolute inset-0 bg-invite-navy/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/90 flex items-center justify-center">
                  <Check className="w-6 h-6 text-invite-navy" />
                </div>
                <span className="font-heading text-base md:text-lg">Presente escolhido</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 text-center">
          <h3 className="font-heading text-lg md:text-xl text-invite-navy font-medium line-clamp-1">
            {gift.name}
          </h3>

          {price && (
            <p className="font-body text-sm text-invite-gold-deep tracking-wide mt-1.5">{price}</p>
          )}

          {!gift.is_selected ? (
            <motion.button
              data-testid={`select-gift-${gift.id}`}
              onClick={() => onSelect(gift)}
              whileTap={{ scale: 0.97 }}
              className="mt-5 w-full rounded-full border border-invite-navy text-invite-navy hover:bg-invite-navy hover:text-white font-body text-xs tracking-[0.2em] uppercase py-3 transition-all"
            >
              Escolher
            </motion.button>
          ) : (
            <div className="mt-5 w-full rounded-full bg-invite-blue-mist/50 text-invite-navy font-body text-xs tracking-[0.18em] uppercase py-3">
              Já com um lar
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
