import { useState, useEffect, FormEvent } from 'react';
import api from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
}

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega produtos quando abre a tela
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err: any) {
      console.log('Erro ao buscar produtos:', err);
      // Se token expirou, desloga
      if (err.response?.status === 401) {
        localStorage.removeItem('@raizes:token');
        window.location.href = '/';
      }
    }
  }

  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault();
    if (!name || !price) return;
    
    setLoading(true);
    try {
      await api.post('/products', { 
        name, 
        price: Number(price) 
      });
      
      alert('Produto cadastrado com sucesso!');
      setName('');
      setPrice('');
      await loadProducts(); // Recarrega a lista
    } catch (err: any) {
      console.log('Erro ao cadastrar:', err.response?.data);
      alert('Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    const confirmDelete = window.confirm('Tem certeza que quer excluir este produto?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      alert('Produto excluído!');
      await loadProducts(); // Recarrega a lista sem o item
    } catch (err: any) {
      console.log('Erro ao excluir:', err.response?.data);
      alert('Erro ao excluir produto');
    }
  }

  function handleLogout() {
    localStorage.removeItem('@raizes:token');
    window.location.href = '/';
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Painel</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <h2>Novo Produto</h2>
      <form onSubmit={handleCreateProduct} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ marginRight: 10, padding: 8 }}
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          step="0.01"
          style={{ marginRight: 10, padding: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastro'}
        </button>
      </form>

      <h2>Produtos</h2>
      {products.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map(product => (
            <li 
              key={product.id} 
              style={{ 
                marginBottom: 8, 
                padding: 10, 
                border: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>
                <strong>{product.name}</strong> - R$ {product.price.toFixed(2)}
              </span>
              <button 
                onClick={() => handleDeleteProduct(product.id)}
                style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px' }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}