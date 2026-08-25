import { useState, FormEvent } from 'react';
import  api  from '../services/api';

export function Login() {
  const [email, setEmail] = useState('admin@raizes.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault(); // Impede a página de recarregar
    setLoading(true);
    
    try {
      const { data } = await api.post('/login', { email, password });
      
      // Salva o token com a chave @raizes:token
      localStorage.setItem('@raizes:token', data.token);
      
      console.log('Login realizado, token salvo!');
      
      // Redireciona pro dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.log('Erro no login:', err);
      alert('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h1>Login - Raízes Nordeste</h1>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: 10 }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}