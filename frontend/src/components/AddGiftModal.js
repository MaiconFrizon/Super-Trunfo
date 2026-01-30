import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AddGiftModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    image_url: initialData?.image_url || ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.image_url) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    
    // Reset form
    setFormData({ name: '', image_url: '' });
  };

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        image_url: initialData?.image_url || ''
      });
    }
  }, [isOpen, initialData]);

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
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="font-heading text-2xl font-semibold text-stone-800">
                {initialData ? 'Editar Presente' : 'Adicionar Novo Presente'}
              </h2>
              <button
                onClick={onClose}
                data-testid="close-add-gift-modal"
                className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none"
                  placeholder="Ex: Jogo de Panelas Inox"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-stone-700 mb-2">
                  Imagem do Presente *
                </label>
                
                {/* Image Preview */}
                {formData.image_url && (
                  <div className="mb-4 relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, image_url: ''})}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
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
                          <p className="font-body text-sm text-stone-600">
                            Clique para trocar a imagem
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-stone-400" />
                          <p className="font-body font-medium text-stone-700">
                            Clique para fazer upload
                          </p>
                          <p className="font-body text-sm text-stone-500">
                            PNG, JPG até 5MB
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full px-6 py-3 font-body font-medium transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="submit-gift-button"
                  disabled={loading || uploading || !formData.name || !formData.image_url}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-4 font-body font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </span>
                  ) : (
                    initialData ? 'Atualizar Presente' : 'Adicionar Presente'
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
