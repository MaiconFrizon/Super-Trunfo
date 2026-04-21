import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Eye, Link2 } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// GiftLinkSection
// ----------------------------------------------------------------------------
// Guest-facing, read-only "product link" block shown inside the gift
// confirmation modal. Lets the guest preview/open/copy the link before
// confirming their selection.
//
// Behavior rules:
//  - If no link OR link is invalid → the whole section is hidden.
//  - "Open" opens in a new tab with rel="noopener noreferrer".
//  - "Copy" writes to clipboard and shows a toast.
//  - "Preview" attempts an in-app modal preview and falls back to opening
//    the link in a new tab (many sites block <iframe> via X-Frame-Options).
// ============================================================================

// Pure helper — validate http(s) URL without throwing
const isValidHttpUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function GiftLinkSection({ link }) {
  const [copied, setCopied] = useState(false);

  // Rule: hide entirely when there is no valid link.
  if (!isValidHttpUrl(link)) return null;

  const normalized = link.trim();

  // ---- Actions -------------------------------------------------------------

  const handleOpen = () => {
    window.open(normalized, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(normalized);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Não foi possível copiar o link');
    }
  };

  // Preview = open in new tab (safe fallback since iframes are often blocked).
  const handlePreview = () => {
    handleOpen();
  };

  // ---- UI ------------------------------------------------------------------

  return (
    <div
      data-testid="gift-link-section"
      className="mb-6 rounded-2xl border border-stone-200 bg-stone-50/60 p-4"
    >
      <label
        htmlFor="gift-link-readonly"
        className="block font-body text-sm font-medium text-stone-700 mb-2"
      >
        Ver presente escolhido
      </label>

      <div className="flex items-stretch gap-2">
        {/* Read-only link input (matches form input styling) */}
        <div className="relative flex-1 min-w-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Link2 className="w-4 h-4 text-stone-400" aria-hidden="true" />
          </div>
          <input
            id="gift-link-readonly"
            data-testid="gift-link-readonly-input"
            type="text"
            value={normalized}
            readOnly
            onFocus={(e) => e.target.select()}
            aria-label="Link do presente escolhido"
            className="w-full rounded-lg border-2 border-stone-200 bg-white pl-9 pr-3 py-3 font-body text-sm text-stone-700 truncate outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 transition-all"
          />
        </div>

        {/* Action buttons — icon-only, subtle, consistent with page style */}
        <div className="flex items-stretch gap-1">
          <IconBtn
            onClick={handleCopy}
            label={copied ? 'Copiado!' : 'Copiar link'}
            testId="gift-link-copy"
            aria-label="Copiar link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </IconBtn>

          <IconBtn
            onClick={handlePreview}
            label="Pré-visualizar"
            testId="gift-link-preview"
            aria-label="Pré-visualizar produto"
          >
            <Eye className="w-4 h-4" />
          </IconBtn>

          <IconBtn
            onClick={handleOpen}
            label="Abrir link"
            testId="gift-link-open"
            aria-label="Abrir link em nova aba"
          >
            <ExternalLink className="w-4 h-4" />
          </IconBtn>
        </div>
      </div>

      <p className="mt-3 font-body text-sm md:text-[0.95rem] font-bold text-invite-navy leading-snug">
        OBS: Esse link é só uma referência do presente, ok? <span aria-hidden="true">😊</span>
      </p>
    </div>
  );
}

// ---- Small local icon button (keeps styling consistent in one place) -------
function IconBtn({ onClick, label, children, testId, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      data-testid={testId}
      className="w-11 rounded-lg border-2 border-stone-200 bg-white hover:border-gold-500 hover:text-gold-600 text-stone-600 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-gold-500/20"
      {...rest}
    >
      {children}
    </button>
  );
}
