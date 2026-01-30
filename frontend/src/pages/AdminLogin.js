import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Por favor, insira a senha');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem('admin_token', response.data.access_token);
      toast.success('👋 Bem-vindo(a) de volta!', {
        description: 'Carregando seu dashboard...',
        duration: 2000
      });
      setTimeout(() => navigate('/admin/dashboard'), 500);
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Senha incorreta', {
        description: 'Verifique e tente novamente',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50 to-gold-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-50 rounded-full mb-4">
              <Lock className="w-8 h-8 text-gold-600" />
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-stone-800 mb-2">
              Área Administrativa
            </h1>
            
            <p className="font-body text-base text-stone-600">
              Acesso restrito aos organizadores
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block font-body text-sm font-medium text-stone-700 mb-2">
                Senha de Acesso
              </label>
              <input
                id="password"
                type="password"
                data-testid="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-stone-200 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/20 bg-stone-50/50 px-4 py-3 font-body text-stone-800 transition-all outline-none"
                placeholder="Digite a senha"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              data-testid="admin-login-button"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white rounded-full px-8 py-4 font-body font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <button
              onClick={() => navigate('/')}
              className="w-full text-center font-body text-sm text-stone-500 hover:text-gold-600 transition-colors"
            >
              ← Voltar para lista de presentes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
