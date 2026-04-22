import { log } from '../lib/log';
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
      log.error('Erro no login:', error);
      toast.error('Senha incorreta', {
        description: 'Verifique e tente novamente',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-invite-ivory flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-invite-navy/10">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-invite-blue-mist/60 rounded-full mb-4"
            >
              <Lock className="w-8 h-8 text-invite-navy" />
            </motion.div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-invite-navy mb-2">
              Bem-vindo(a) de volta
            </h1>
            
            <p className="font-body text-sm text-invite-ink/60">
              Acesso restrito aos organizadores
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block font-body text-xs tracking-[0.18em] uppercase text-invite-navy mb-2">
                Senha de Acesso
              </label>
              <input
                id="password"
                type="password"
                data-testid="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-invite-navy/15 focus:border-invite-navy focus:ring-4 focus:ring-invite-navy/10 bg-invite-ivory-soft px-4 py-3 font-body text-invite-ink transition-all outline-none"
                placeholder="Digite a senha"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              data-testid="admin-login-button"
              disabled={loading}
              className="w-full bg-invite-navy hover:bg-invite-blue text-white rounded-full px-8 py-4 font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-invite-navy/10">
            <button
              onClick={() => navigate('/')}
              className="w-full text-center font-body text-xs tracking-[0.16em] uppercase text-invite-ink/50 hover:text-invite-navy transition-colors"
            >
              ← Voltar para lista de presentes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
