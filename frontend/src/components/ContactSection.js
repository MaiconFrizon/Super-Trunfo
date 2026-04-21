import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// ContactSection — WhatsApp-focused contact block integrated into the main
// wedding page. Matches the site palette (invite-ivory bg, invite-navy primary,
// gold accent) and typography (script heading + serif body).
// Two CTAs open wa.me chats with pre-filled messages (URL-encoded).
// ============================================================================

// Contact data — phone numbers in international E.164 (digits only) format
const CONTACTS = [
  {
    key: 'thalita',
    name: 'Thalita',
    label: 'Falar com o Noivo',
    phone: '5546991404481',
    message: 'Oi Thalita! Vim pelo site do casamento 💙'
  },
  {
    key: 'maicon',
    name: 'Maicon',
    label: 'Falar com a Noiva',
    phone: '5514997206571',
    message: 'Oi Maicon! Vim pelo site do casamento 💙'
  }
];

const buildWaLink = (phone, message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

// Inline WhatsApp icon (no extra icon pack needed, stays consistent with section)
function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.1 17.6c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.2-.8.9-1 1.1-.4.2-.7.1-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.4.1-.6c.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5s.1-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3 2.1 3.2 5.2 4.5c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.8 1 3.9 1.5 6.2 1.5 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.8c-2 0-4-.5-5.7-1.5l-.4-.2-4 1.1 1.1-3.9-.3-.4C5.6 20.2 5 18.1 5 16c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 10.8-11 10.8z" />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contato"
      className="contact-section relative bg-invite-ivory px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-t border-invite-navy/10 scroll-mt-20"
      data-testid="contact-section"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Gold flourish */}
        <div className="divider-flourish mb-6">
          <span className="heart">♡</span>
        </div>

        {/* Script title */}
        <h2 className="contact-title font-script text-invite-navy leading-none text-[2.75rem] md:text-6xl">
          Entre em Contato
        </h2>

        {/* Supporting copy */}
        <p className="contact-subtitle font-heading italic text-invite-ink/70 text-base md:text-lg mt-4">
          Será um prazer falar com você{' '}
          <span className="text-invite-navy not-italic">💙</span>
        </p>

        {/* Buttons — stacked on mobile, horizontal on desktop */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
          }}
          className="contact-buttons mt-10 md:mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-5"
        >
          {CONTACTS.map((c) => (
            <motion.a
              key={c.key}
              href={buildWaLink(c.phone, c.message)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`whatsapp-btn-${c.key}`}
              aria-label={c.label}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="whatsapp-button group inline-flex w-full md:w-auto items-center justify-center gap-3 rounded-full bg-invite-navy hover:bg-invite-blue active:bg-invite-blue text-white px-8 md:px-10 min-h-[56px] py-4 font-body text-sm md:text-xs tracking-[0.18em] md:tracking-[0.22em] uppercase transition-colors duration-300 shadow-[0_10px_28px_-12px_rgba(52,78,138,0.45)] hover:shadow-[0_18px_34px_-12px_rgba(52,78,138,0.55)] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-invite-navy/20"
            >
              <WhatsAppIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{c.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Subtle helper line */}
        <p className="font-body text-xs text-invite-ink/45 mt-6 tracking-wide">
          Respondemos com carinho o mais breve possível
        </p>
      </motion.div>
    </section>
  );
}
