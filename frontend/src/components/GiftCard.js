import React from 'react';
import { motion } from 'framer-motion';
import { Check, Heart } from 'lucide-react';

export default function GiftCard({ gift, index, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-100/50 transition-all duration-500 border border-stone-100 relative">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7 }}
            src={gift.image_url}
            alt={gift.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop';
            }}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay for selected gifts */}
          {gift.is_selected && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center px-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <Check className="w-8 h-8 text-rose-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="font-body text-white font-semibold text-lg block mb-1">
                    Este presente já encontrou
                  </span>
                  <span className="font-body text-white font-semibold text-lg block">
                    um coração especial 💛
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-xl font-semibold text-stone-800 mb-4 line-clamp-2 group-hover:text-gold-600 transition-colors">
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
            <>
              <p className="text-xs text-center text-stone-500 mb-3 italic">
                Explore à vontade, sem compromisso
              </p>
              <motion.button
                data-testid={`select-gift-${gift.id}`}
                onClick={() => onSelect(gift)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-3 font-body font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/button"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 group-hover/button:fill-current" />
                </motion.div>
                <span>Quero dar este presente 💝</span>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
