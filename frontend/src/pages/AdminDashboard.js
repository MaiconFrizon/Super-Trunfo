import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, LogOut, Plus, Edit2, Trash2, Download, Upload, User, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import AddGiftModal from '../components/AddGiftModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchGifts();
  }, [navigate]);

  const fetchGifts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/gifts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGifts(response.data);
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('admin_token');
        navigate('/admin');
      } else {
        toast.error('Erro ao carregar presentes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logout realizado');
    navigate('/admin');
  };

  const handleAddGift = async (giftData) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API}/admin/gifts`, giftData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✨ Presente adicionado!', {
        description: 'O novo presente está disponível para escolha',
        duration: 3000
      });
      setShowAddModal(false);
      fetchGifts();
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
      toast.error('Erro ao adicionar presente', {
        description: 'Tente novamente',
        duration: 3000
      });
    }
  };

  const handleUpdateGift = async (giftId, giftData) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API}/admin/gifts/${giftId}`, giftData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✓ Presente atualizado!', {
        description: 'As alterações foram salvas',
        duration: 3000
      });
      setEditingGift(null);
      fetchGifts();
    } catch (error) {
      console.error('Erro ao atualizar presente:', error);
      toast.error('Erro ao atualizar presente', {
        description: 'Tente novamente',
        duration: 3000
      });
    }
  };

  const handleDeleteGift = async (giftId) => {
    if (!window.confirm('Tem certeza que deseja remover este presente?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/admin/gifts/${giftId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('🗑️ Presente removido', {
        description: 'O presente foi excluído da lista',
        duration: 3000
      });
      fetchGifts();
    } catch (error) {
      console.error('Erro ao remover presente:', error);
      toast.error('Erro ao remover presente', {
        description: 'Tente novamente',
        duration: 3000
      });
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('📊 Dados exportados!', {
        description: 'O arquivo CSV foi baixado com sucesso',
        duration: 3000
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados', {
        description: 'Tente novamente',
        duration: 3000
      });
    }
  };

  const availableCount = gifts.filter(g => !g.is_selected).length;
  const selectedCount = gifts.filter(g => g.is_selected).length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-semibold text-stone-800">
                  Dashboard Administrativo
                </h1>
                <p className="font-body text-sm text-stone-500">Gerenciar presentes e convidados</p>
              </div>
            </div>
            
            <button
              data-testid="admin-logout-button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-stone-500 hover:text-gold-600 font-body font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-8 bg-gradient-to-r from-rose-50 to-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 cursor-pointer transition-all duration-300 hover:border-stone-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-stone-500 uppercase tracking-widest mb-1">Total de Presentes</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-heading text-4xl font-bold text-stone-800"
                  >
                    {gifts.length}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center"
                >
                  <Gift className="w-7 h-7 text-stone-600" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(212, 175, 55, 0.2), 0 10px 10px -5px rgba(212, 175, 55, 0.1)" }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 cursor-pointer transition-all duration-300 hover:border-gold-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-stone-500 uppercase tracking-widest mb-1">Disponíveis ✨</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-heading text-4xl font-bold text-gold-600"
                  >
                    {availableCount}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 bg-gold-50 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-7 h-7 text-gold-600" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(244, 114, 182, 0.2), 0 10px 10px -5px rgba(244, 114, 182, 0.1)" }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 cursor-pointer transition-all duration-300 hover:border-rose-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-stone-500 uppercase tracking-widest mb-1">Escolhidos 💝</p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-heading text-4xl font-bold text-rose-500"
                  >
                    {selectedCount}
                  </motion.p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-7 h-7 text-rose-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            <motion.button
              data-testid="add-gift-button"
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-3 font-body font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Plus className="w-5 h-5" />
              </motion.div>
              <span>Adicionar Presente</span>
            </motion.button>

            <motion.button
              data-testid="export-data-button"
              onClick={handleExport}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-full px-6 py-3 font-body font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Exportar Dados</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Gifts Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-body text-stone-600">Carregando dados...</p>
            </div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-20">
              <Gift className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="font-body text-xl text-stone-600 mb-4">Nenhum presente cadastrado</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-3 font-body font-bold transition-all duration-300 shadow-lg"
              >
                Adicionar Primeiro Presente
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-body text-sm font-semibold text-stone-700 uppercase tracking-wider">Presente</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-semibold text-stone-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-semibold text-stone-700 uppercase tracking-wider">Escolhido Por</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-semibold text-stone-700 uppercase tracking-wider">Contato</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-semibold text-stone-700 uppercase tracking-wider">Mensagem</th>
                      <th className="px-6 py-4 text-right font-body text-sm font-semibold text-stone-700 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {gifts.map((gift) => (
                      <tr key={gift.id} className="hover:bg-stone-50 transition-colors" data-testid={`gift-row-${gift.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={gift.image_url}
                              alt={gift.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-body font-medium text-stone-800">{gift.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {gift.is_selected ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-body text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Escolhido
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-100 text-gold-700 font-body text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Disponível
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {gift.selected_by ? (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-stone-400" />
                              <span className="font-body text-sm text-stone-700">
                                {gift.selected_by.first_name} {gift.selected_by.last_name}
                              </span>
                            </div>
                          ) : (
                            <span className="font-body text-sm text-stone-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {gift.selected_by?.contact ? (
                            <span className="font-body text-sm text-stone-700">{gift.selected_by.contact}</span>
                          ) : (
                            <span className="font-body text-sm text-stone-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {gift.selected_by?.message ? (
                            <div className="flex items-start gap-2 max-w-xs">
                              <MessageCircle className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                              <button
                                onClick={() => setViewingDetails(gift)}
                                className="font-body text-sm text-gold-600 hover:text-gold-700 underline text-left"
                              >
                                Ver mensagem completa
                              </button>
                            </div>
                          ) : (
                            <span className="font-body text-sm text-stone-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              data-testid={`edit-gift-${gift.id}`}
                              onClick={() => setEditingGift(gift)}
                              className="p-2 text-stone-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              data-testid={`delete-gift-${gift.id}`}
                              onClick={() => handleDeleteGift(gift.id)}
                              className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Gift Modal */}
      <AddGiftModal
        isOpen={showAddModal || !!editingGift}
        onClose={() => {
          setShowAddModal(false);
          setEditingGift(null);
        }}
        onSubmit={editingGift ? (data) => handleUpdateGift(editingGift.id, data) : handleAddGift}
        initialData={editingGift}
      />

      {/* Gift Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setViewingDetails(null)}
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
            <button
              onClick={() => setViewingDetails(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="font-heading text-2xl font-semibold text-stone-800 mb-2">
                {viewingDetails.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  viewingDetails.is_selected
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-gold-100 text-gold-700'
                }`}>
                  {viewingDetails.is_selected ? 'Escolhido' : 'Disponível'}
                </span>
              </div>
            </div>

            {viewingDetails.selected_by && (
              <div className="space-y-4">
                <div className="bg-stone-50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="font-body text-xs text-stone-500 uppercase tracking-wider mb-1">
                      Escolhido por
                    </p>
                    <p className="font-body text-lg text-stone-800 font-medium">
                      {viewingDetails.selected_by.first_name} {viewingDetails.selected_by.last_name}
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-xs text-stone-500 uppercase tracking-wider mb-1">
                      Contato
                    </p>
                    <p className="font-body text-base text-stone-700">
                      {viewingDetails.selected_by.contact}
                    </p>
                  </div>

                  {viewingDetails.selected_by.selected_at && (
                    <div>
                      <p className="font-body text-xs text-stone-500 uppercase tracking-wider mb-1">
                        Data de Seleção
                      </p>
                      <p className="font-body text-base text-stone-700">
                        {new Date(viewingDetails.selected_by.selected_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>

                {viewingDetails.selected_by.message && (
                  <div className="bg-rose-50 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-body text-xs text-rose-700 uppercase tracking-wider mb-2">
                          Mensagem para os noivos
                        </p>
                        <p className="font-body text-base text-stone-700 leading-relaxed">
                          "{viewingDetails.selected_by.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setViewingDetails(null)}
              className="mt-6 w-full bg-gold-500 hover:bg-gold-600 text-white rounded-full px-6 py-3 font-body font-bold transition-all duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
