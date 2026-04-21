import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Send } from 'lucide-react';
import GiftLinkSection from './GiftLinkSection';

export default function GiftModal({ gift, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.contact) {
      return;
    }

    setLoading(true);
    await onConfirm(formData);
    setLoading(false);
    
    // Reset form
    setFormData({
      first_name: '',
      last_name: '',
      contact: '',
      message: ''
    });
  };

  return (
    <AnimatePresence>
      {gift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              data-testid="close-gift-modal"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>

            {/* Image */}
            <div className="relative aspect-video bg-stone-100 overflow-hidden">
              <img
                src={gift.image_url}
                alt={gift.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
                  {gift.name}
                </h2>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-3 mb-6 bg-invite-blue-mist/50 rounded-2xl p-4 border border-invite-navy/10">
                <Heart className="w-6 h-6 text-invite-navy flex-shrink-0 mt-1" fill="currentColor" />
                <div>
                  <p className="font-heading text-base text-invite-navy font-medium mb-1">
                    Você escolheu um presente lindo
                  </p>
                  <p className="font-body text-sm text-invite-ink/70">
                    Agora só faltam alguns detalhes. Fique tranquilo(a), é rapidinho.
                  </p>
                </div>
              </div>

              {/* Gift link block — only renders when a valid link exists */}
              <GiftLinkSection link={gift.link} />

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block font-body text-sm font-medium text-stone-700 mb-2">
                      Como podemos te chamar? *
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      data-testid="guest-first-name-input"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block font-body text-sm font-medium text-stone-700 mb-2">
                      Sobrenome *
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      data-testid="guest-last-name-input"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact" className="block font-body text-sm font-medium text-stone-700 mb-2">
                    Como os noivos podem agradecer? *
                  </label>
                  <input
                    id="contact"
                    type="text"
                    data-testid="guest-contact-input"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none"
                    placeholder="Email ou WhatsApp"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-sm font-medium text-stone-700 mb-2">
                    Quer deixar uma mensagem? (Opcional, mas eles vão amar 💛)
                  </label>
                  <textarea
                    id="message"
                    data-testid="guest-message-input"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none resize-none"
                    placeholder="Escreva algo que saia do coração..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full px-6 py-3 font-body font-medium transition-all duration-300"
                  >
                    Voltar para escolher outro
                  </button>
                  <button
                    type="submit"
                    data-testid="confirm-gift-selection"
                    disabled={loading}
                    className="flex-1 bg-invite-navy hover:bg-invite-blue text-white rounded-full px-6 py-4 font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Confirmando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirmar com carinho</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
