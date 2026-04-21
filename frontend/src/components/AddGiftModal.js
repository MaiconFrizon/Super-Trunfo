import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Link2, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============================================================================
// URL VALIDATION HELPERS (Gift Link feature - Admin only)
// ============================================================================

/**
 * Normalize a user-provided URL string:
 *  - Trims surrounding whitespace
 *  - Adds "https://" prefix when the user types "www.xxx" without protocol
 */
const normalizeUrl = (raw) => {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  // Auto-prefix https:// when user types www.site.com
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
};

/**
 * Validate that the string is a well-formed http(s) URL.
 * Returns true only for protocols http or https.
 */
const isValidHttpUrl = (value) => {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function AddGiftModal({ isOpen, onClose, onSubmit, initialData }) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    image_url: initialData?.image_url || '',
    link: initialData?.link || '',
    price: initialData?.price ?? ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gift Link — validation state (debounced)
  const [linkError, setLinkError] = useState('');
  const [linkTouched, setLinkTouched] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const debounceRef = useRef(null);

  // ---------------------------------------------------------------------------
  // GIFT LINK — debounced validation (300ms)
  // ---------------------------------------------------------------------------
  const validateLink = useCallback((value) => {
    const normalized = normalizeUrl(value);
    if (!normalized) {
      setLinkError('O link do presente é obrigatório');
      return;
    }
    if (!isValidHttpUrl(normalized)) {
      setLinkError('Insira uma URL válida');
      return;
    }
    setLinkError('');
  }, []);

  const handleLinkChange = (e) => {
    const value = e.target.value;
    // Real-time state update (preserve user's raw input while typing)
    setFormData((prev) => ({ ...prev, link: value }));
    setLinkTouched(true);

    // Debounce validation by 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => validateLink(value), 300);
  };

  const handleLinkBlur = () => {
    // On blur we normalize the value (trim + add https://) and validate immediately
    const normalized = normalizeUrl(formData.link);
    setFormData((prev) => ({ ...prev, link: normalized }));
    setLinkTouched(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    validateLink(normalized);
  };

  const linkIsValid = !linkError && isValidHttpUrl(normalizeUrl(formData.link));

  // ---------------------------------------------------------------------------
  // GIFT LINK — preview & copy actions
  // ---------------------------------------------------------------------------
  const handlePreviewLink = () => {
    if (!linkIsValid) return;
    const normalized = normalizeUrl(formData.link);
    window.open(normalized, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    const normalized = normalizeUrl(formData.link);
    if (!normalized) return;
    try {
      await navigator.clipboard.writeText(normalized);
      setLinkCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      toast.error('Não foi possível copiar o link');
    }
  };

  // ---------------------------------------------------------------------------
  // IMAGE UPLOAD (unchanged)
  // ---------------------------------------------------------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await axios.post(`${API}/admin/upload`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({ ...formData, image_url: response.data.url });
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate submissions

    const normalizedLink = normalizeUrl(formData.link);

    // Final guard — block if any required field is missing or link invalid
    if (!formData.name || !formData.image_url) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (!isValidHttpUrl(normalizedLink)) {
      setLinkTouched(true);
      setLinkError(normalizedLink ? 'Insira uma URL válida' : 'O link do presente é obrigatório');
      toast.error('Insira um link válido para o presente');
      return;
    }

    setLoading(true);
    try {
      // Coerce price to number or null
      const priceNum = formData.price === '' || formData.price === null ? null : Number(formData.price);
      await onSubmit({
        ...formData,
        link: normalizedLink,
        price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : null
      });
    } finally {
      setLoading(false);
    }

    // Reset form
    setFormData({ name: '', image_url: '', link: '', price: '' });
    setLinkError('');
    setLinkTouched(false);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        image_url: initialData?.image_url || '',
        link: initialData?.link || '',
        price: initialData?.price ?? ''
      });
      setLinkError('');
      setLinkTouched(false);
      setLinkCopied(false);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isOpen, initialData]);

  // Submit-button disabled logic — link must be present AND valid
  const submitDisabled =
    loading ||
    uploading ||
    !formData.name ||
    !formData.image_url ||
    !linkIsValid;

  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-heading text-2xl font-semibold text-stone-800">
                {initialData ? 'Editar Presente' : 'Adicionar Novo Presente'}
              </h2>
              <button
                onClick={onClose}
                data-testid="close-add-gift-modal"
                aria-label="Fechar modal"
                className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              {/* --- Gift Name --- */}
              <div>
                <label htmlFor="gift_name" className="block font-body text-sm font-medium text-stone-700 mb-2">
                  Nome do Presente *
                </label>
                <input
                  id="gift_name"
                  type="text"
                  data-testid="gift-name-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none"
                  placeholder="Ex: Jogo de Panelas Inox"
                />
              </div>

              {/* --- Gift Link (NEW — Admin only) --- */}
              <div>
                <label
                  htmlFor="gift_link"
                  className="block font-body text-sm font-medium text-stone-700 mb-2"
                >
                  Link do Presente *
                </label>

                <div className="relative">
                  {/* Leading icon */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Link2 className="w-5 h-5 text-stone-400" aria-hidden="true" />
                  </div>

                  <input
                    id="gift_link"
                    name="gift_link"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    data-testid="gift-link-input"
                    aria-label="Link do presente"
                    aria-invalid={linkTouched && !!linkError}
                    aria-describedby={linkError ? 'gift-link-error' : undefined}
                    required
                    value={formData.link}
                    onChange={handleLinkChange}
                    onBlur={handleLinkBlur}
                    placeholder="Ex: https://loja.com/produto"
                    className={`w-full rounded-lg border-2 pl-10 pr-24 py-3 font-body text-stone-800 bg-stone-50/50 transition-all outline-none focus:ring-4 ${
                      linkTouched && linkError
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-stone-200 focus:border-gold-500 focus:ring-gold-500/20'
                    }`}
                  />

                  {/* Trailing action buttons (Preview + Copy) */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                    {/* Copy button */}
                    <button
                      type="button"
                      data-testid="gift-link-copy-button"
                      onClick={handleCopyLink}
                      disabled={!formData.link}
                      aria-label="Copiar link"
                      title="Copiar link"
                      className="w-9 h-9 rounded-md flex items-center justify-center text-stone-500 hover:text-gold-600 hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {linkCopied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Preview button — only enabled when link is valid */}
                    <button
                      type="button"
                      data-testid="gift-link-preview-button"
                      onClick={handlePreviewLink}
                      disabled={!linkIsValid}
                      aria-label="Pré-visualizar link em nova aba"
                      title={linkIsValid ? 'Abrir link em nova aba' : 'Insira um link válido para pré-visualizar'}
                      className="w-9 h-9 rounded-md flex items-center justify-center text-stone-500 hover:text-gold-600 hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {linkTouched && linkError && (
                  <p
                    id="gift-link-error"
                    data-testid="gift-link-error"
                    role="alert"
                    className="mt-2 flex items-center gap-1.5 text-sm text-red-600 font-body"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {linkError}
                  </p>
                )}
              </div>

              {/* --- Gift Price (optional) --- */}
              <div>
                <label htmlFor="gift_price" className="block font-body text-sm font-medium text-stone-700 mb-2">
                  Preço (opcional)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 font-body text-sm">R$</span>
                  <input
                    id="gift_price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    data-testid="gift-price-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 799,00"
                    className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 pl-10 pr-4 py-3 font-body text-stone-800 transition-all outline-none"
                  />
                </div>
                <p className="mt-1 font-body text-xs text-stone-500">Exibido no card do presente. Deixe vazio para ocultar.</p>
              </div>

              {/* --- Gift Image --- */}
              <div>
                <label className="block font-body text-sm font-medium text-stone-700 mb-2">
                  Imagem do Presente *
                </label>

                {formData.image_url && (
                  <div className="mb-4 relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      aria-label="Remover imagem"
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>
                )}

                <label
                  htmlFor="image_upload"
                  className={`block w-full rounded-lg border-2 border-dashed border-stone-300 hover:border-gold-500 bg-stone-50 p-8 text-center cursor-pointer transition-all ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    id="image_upload"
                    type="file"
                    data-testid="gift-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />

                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-body text-sm text-stone-600">Fazendo upload...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      {formData.image_url ? (
                        <>
                          <ImageIcon className="w-12 h-12 text-gold-500" />
                          <p className="font-body text-sm text-stone-600">Clique para trocar a imagem</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-stone-400" />
                          <p className="font-body font-medium text-stone-700">Clique para fazer upload</p>
                          <p className="font-body text-sm text-stone-500">PNG, JPG até 5MB</p>
                        </>
                      )}
                    </div>
                  )}
                </label>
              </div>

              {/* --- Actions --- */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  data-testid="cancel-gift-button"
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full px-6 py-3 font-body font-medium transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="submit-gift-button"
                  disabled={submitDisabled}
                  aria-disabled={submitDisabled}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-4 font-body font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </span>
                  ) : initialData ? (
                    'Atualizar Presente'
                  ) : (
                    'Adicionar Presente'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
