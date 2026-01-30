import React from 'react';
import { motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';

export default function GiftCard({ gift, index, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 border border-stone-100 relative">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <img
            src={gift.image_url}
            alt={gift.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay for selected gifts */}
          {gift.is_selected && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-rose-500" />
                </div>
                <span className="font-body text-white font-semibold text-lg">Já Escolhido</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-xl font-semibold text-stone-800 mb-4 line-clamp-2">
            {gift.name}
          </h3>

          {gift.is_selected ? (
            <div className="text-center py-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-700 font-body text-sm font-medium">
                <Check className="w-4 h-4" />
                Presente Escolhido
              </span>
            </div>
          ) : (
            <button
              data-testid={`select-gift-${gift.id}`}
              onClick={() => onSelect(gift)}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-3 font-body font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              <span>Escolher este Presente</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
