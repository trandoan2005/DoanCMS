import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PostDetail from './PostDetail';
import ProductDetail from './ProductDetail';

const API = 'https://localhost:7226';

function Home({ categories, posts, productCategories, products, addToCart, addedId }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  const filtered = selectedCategory ? posts.filter(p => p.categoryId === selectedCategory) : posts;
  const filteredProducts = selectedProductCategory ? products.filter(p => p.categoryProductId === selectedProductCategory) : products;

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '13px', letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase' }}>Hệ thống quản lý nội dung & Bán hàng</div>
        <h1 style={{ fontSize: '56px', fontWeight: '800', margin: '0 0 16px', letterSpacing: '-2px', background: 'linear-gradient(135deg, #fff 30%, rgba(0,200,255,0.9))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DoanCMS Store</h1>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>Website thời trang & tin tức · Cao Đẳng Công Thương TPHCM</p>
        
        {/* Stats Section */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
          {[
            { label: 'Danh mục bài viết', value: categories.length },
            { label: 'Bài viết', value: posts.length },
            { label: 'Danh mục sản phẩm', value: productCategories.length },
            { label: 'Sản phẩm', value: products.length }
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '16px 28px', textAlign: 'center', minWidth: '140px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>
        {/* TABS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
          {[
            { id: 'posts', label: '📰 Tin tức & Bài viết', count: posts.length },
            { id: 'products', label: '🛍️ Sản phẩm thời trang', count: products.length }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="cat-btn" style={{ padding: '14px 28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5))' : 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: activeTab === tab.id ? '0 10px 25px rgba(99,102,241,0.25)' : 'none' }}>
              {tab.label}
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '100px', fontSize: '12px' }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* POSTS TAB CONTENT */}
        {activeTab === 'posts' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Lọc theo danh mục bài viết</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[{ id: null, name: 'Tất cả' }, ...categories].map(cat => (
                  <button key={cat.id} className="cat-btn" onClick={() => setSelectedCategory(cat.id)} style={{ padding: '10px 22px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', background: selectedCategory === cat.id ? 'rgba(140,100,255,0.5)' : 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: selectedCategory === cat.id ? '600' : '400' }}>{cat.name}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', textTransform: 'uppercase' }}>{filtered.length} bài viết</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filtered.map((post, i) => (
                <div key={post.id} className="card-hover" onClick={() => navigate(`/post/${post.id}`)} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', animation: `fadeUp 0.5s ease ${i * 0.08}s both`, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img src={post.imageUrl || `https://picsum.photos/400/20${i % 10}`} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = `https://picsum.photos/400/20${i % 10}`} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                    <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(140,100,255,0.85)', backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{post.category?.name}</span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', lineHeight: '1.4', color: 'rgba(255,255,255,0.92)' }}>{post.title}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>📅 {new Date(post.createdDate).toLocaleDateString('vi-VN')} · Nhấn để xem chi tiết →</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB CONTENT */}
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Lọc theo danh mục sản phẩm</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[{ id: null, name: 'Tất cả sản phẩm' }, ...productCategories].map(cat => (
                  <button key={cat.id} className="cat-btn" onClick={() => setSelectedProductCategory(cat.id)} style={{ padding: '10px 22px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)', background: selectedProductCategory === cat.id ? 'rgba(0,200,255,0.5)' : 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: selectedProductCategory === cat.id ? '600' : '400' }}>{cat.name}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', textTransform: 'uppercase' }}>{filteredProducts.length} sản phẩm</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredProducts.map((product, i) => (
                <div 
                  key={product.id} 
                  className="card-hover" 
                  onClick={(e) => {
                    // Chuyển sang trang chi tiết trừ khi nhấn nút Thêm vào giỏ
                    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                      navigate(`/product/${product.id}`);
                    }
                  }}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', 
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', 
                    overflow: 'hidden', cursor: 'pointer', animation: `fadeUp 0.5s ease ${i * 0.08}s both`, 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' 
                  }}
                >
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img src={product.imageUrl || `https://picsum.photos/400/22${i % 10}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = `https://picsum.photos/400/22${i % 10}`} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                    <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,200,255,0.8)', backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>{product.categoryProduct?.name || 'Sản phẩm'}</span>
                    
                    {product.stockQuantity <= 0 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: 'rgba(239,68,68,0.85)', padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: '700' }}>Hết hàng</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '16.5px', fontWeight: '700', color: 'rgba(255,255,255,0.92)' }}>{product.name}</h3>
                    <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description || 'Không có mô tả chi tiết.'}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '19px', fontWeight: '800', color: '#ff6b8b' }}>{product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}</span>
                      <span style={{ fontSize: '11px', color: product.stockQuantity > 0 ? '#55efc4' : '#ff7675', background: product.stockQuantity > 0 ? 'rgba(85,239,196,0.12)' : 'rgba(255,118,117,0.12)', padding: '4px 10px', borderRadius: '8px', fontWeight: '600' }}>
                        {product.stockQuantity > 0 ? `Còn: ${product.stockQuantity}` : 'Hết hàng'}
                      </span>
                    </div>

                    <button
                      className={`add-btn${addedId === product.id ? ' added' : ''}`}
                      disabled={product.stockQuantity <= 0}
                      onClick={() => addToCart(product)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
                        background: product.stockQuantity <= 0 ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.35)',
                        color: product.stockQuantity <= 0 ? 'rgba(255,255,255,0.25)' : 'white',
                        cursor: product.stockQuantity <= 0 ? 'not-allowed' : 'pointer',
                        fontSize: '13.5px', fontWeight: '700',
                        backdropFilter: 'blur(10px)',
                        border: product.stockQuantity <= 0 ? 'none' : '1px solid rgba(99,102,241,0.3)',
                        boxShadow: product.stockQuantity <= 0 ? 'none' : '0 4px 15px rgba(99,102,241,0.15)'
                      }}
                    >
                      {addedId === product.id ? '✅ Đã thêm!' : product.stockQuantity <= 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GlobalLayout({ children, cartCount, setShowCart, currentUser, setShowAuthModal, setCurrentUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('doan_cms_user');
  };

  return (
    <div>
      {/* ── NAVBAR ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
        <div onClick={() => navigate('/')} style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', cursor: 'pointer', background: 'linear-gradient(135deg, #00c8ff, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✦ DoanCMS
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* User Account Section */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13.5px', color: '#55efc4', background: 'rgba(85,239,196,0.12)', padding: '8px 14px', borderRadius: '10px', fontWeight: '700', border: '1px solid rgba(85,239,196,0.2)' }}>
                👋 Chào, {currentUser.fullName}
              </span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px', fontWeight: '500', textDecoration: 'underline', transition: 'color 0.2s' }} className="hover-link">
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '10px 18px', color: 'white', cursor: 'pointer',
              fontSize: '13.5px', fontWeight: '700', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              🔑 Đăng nhập
            </button>
          )}

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

          {/* Cart Button */}
          <button onClick={() => setShowCart(true)} style={{
            position: 'relative', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '12px', padding: '10px 18px', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(99,102,241,0.2)'
          }}>
            🛒 Giỏ hàng
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: 'linear-gradient(135deg, #f64f59, #c471ed)',
                borderRadius: '100px', width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '800', animation: 'bounce 0.3s ease'
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Page Area */}
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontSize: '13px', position: 'relative', zIndex: 1 }}>
        © 2026 DoanCMS · Trần Văn Đoàn · MSSV: 2123110210 · CCQ2311F · Cao Đẳng Công Thương TPHCM
      </footer>
    </div>
  );
}

function App() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // ── USER AUTHENTICATION STATE ──
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('doan_cms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ── CART STATE (LOAD FROM LOCAL STORAGE) ──
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('doan_cms_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [addedId, setAddedId] = useState(null); // animation feedback

  // ── CHECKOUT FORM ──
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', notes: '' });
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState('');

  // ── FETCH INITIAL DATA ──
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/categoryapi`).then(r => r.json()),
      fetch(`${API}/api/postapi`).then(r => r.json()),
      fetch(`${API}/api/categoryproductapi`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/productapi`).then(r => r.json()).catch(() => [])
    ]).then(([cats, ps, prodCats, prods]) => {
      setCategories(cats);
      setPosts(ps);
      setProductCategories(prodCats);
      setProducts(prods);
      setLoaded(true);
    }).catch(e => { console.error(e); setLoaded(true); });
  }, []);

  // ── SAVE CART TO LOCAL STORAGE ──
  useEffect(() => {
    localStorage.setItem('doan_cms_cart', JSON.stringify(cart));
  }, [cart]);

  // ── SYNC USER INFO TO CHECKOUT FORM ──
  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      }));
    } else {
      setForm({ fullName: '', email: '', phone: '', address: '', notes: '' });
    }
  }, [currentUser]);

  // ── CART HELPERS ──
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const addToCart = (product) => {
    // CHẶN THÊM VÀO GIỎ NẾU CHƯA ĐĂNG NHẬP
    if (!currentUser) {
      setAuthMode('login');
      setAuthError('Vui lòng đăng nhập để bắt đầu mua sắm!');
      setShowAuthModal(true);
      return;
    }

    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) {
        if (exist.quantity >= product.stockQuantity) return prev;
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity: 1, stock: product.stockQuantity }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQty = (id, delta) => setCart(prev =>
    prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, i.quantity + delta)) } : i)
  );

  // ĐĂNG NHẬP / ĐĂNG KÝ API CALL
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthMessage('');
    setAuthLoading(true);

    const url = authMode === 'login' 
      ? `${API}/api/customerapi/login` 
      : `${API}/api/customerapi/register`;

    const body = authMode === 'login'
      ? { email: authForm.email, password: authForm.password }
      : { fullName: authForm.fullName, email: authForm.email, phone: authForm.phone, address: authForm.address, password: authForm.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        // Lưu thông tin user đăng nhập thành công
        setCurrentUser(data);
        localStorage.setItem('doan_cms_user', JSON.stringify(data));
        setAuthMessage(authMode === 'login' ? '🔑 Đăng nhập thành công!' : '🎉 Đăng ký thành công!');
        
        // Đóng modal sau 1 giây
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthMessage('');
          setAuthError('');
          setAuthForm({ fullName: '', email: '', phone: '', address: '', password: '' });
        }, 1200);
      } else {
        setAuthError(data.message || 'Thao tác thất bại! Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      setAuthError('Không thể kết nối đến máy chủ Backend!');
    }
    setAuthLoading(false);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.address) { 
      setOrderError('Vui lòng điền đầy đủ các thông tin giao nhận bắt buộc!'); 
      return; 
    }
    if (cart.length === 0) { setOrderError('Giỏ hàng của bạn đang trống!'); return; }
    setOrdering(true); setOrderError('');
    try {
      const res = await fetch(`${API}/api/orderapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
          items: cart.map(i => ({ productId: i.id, quantity: i.quantity }))
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderSuccess(data);
        setCart([]);

        // GHI NHỚ THÔNG TIN ĐÃ SỬA ĐỂ MUA LẦN SAU (Cập nhật currentUser địa chỉ mới nhất)
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            fullName: form.fullName,
            phone: form.phone,
            address: form.address
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('doan_cms_user', JSON.stringify(updatedUser));
        }

        // Chỉ xóa ghi chú, giữ pre-fill cho lần mua tiếp theo
        setForm(prev => ({ ...prev, notes: '' }));
      } else {
        setOrderError(data.message || 'Đặt hàng thất bại!');
      }
    } catch (err) {
      setOrderError('Không kết nối được server!');
    }
    setOrdering(false);
  };

  const closeCheckout = () => { setShowCheckout(false); setOrderSuccess(null); setOrderError(''); };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d0b21 0%, #17153a 50%, #0c081e 100%)', fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", color: 'white' }}>
        
        {/* Animated Background Blobs */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)', top: '-250px', left: '-150px', animation: 'float1 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.12), transparent 70%)', bottom: '-150px', right: '-150px', animation: 'float2 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)', top: '35%', left: '35%', animation: 'float3 18s ease-in-out infinite' }} />
        </div>

        <style>{`
          @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,80px)} }
          @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,-50px)} }
          @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-60px)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(35px)} to{opacity:1;transform:translateY(0)} }
          @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
          @keyframes popIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
          @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.25)} }
          .card-hover:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(0,0,0,0.45) !important; border-color: rgba(0,200,255,0.2) !important; }
          .card-hover { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
          .cat-btn:hover { background: rgba(255,255,255,0.22) !important; transform: translateY(-2px); }
          .cat-btn { transition: all 0.3s ease; }
          .add-btn:hover { background: rgba(99,102,241,0.6) !important; transform: translateY(-1px); }
          .add-btn { transition: all 0.25s ease; }
          .add-btn.added { animation: bounce 0.4s ease; background: rgba(16,185,129,0.5) !important; border-color: rgba(16,185,129,0.4) !important; }
          .cart-drawer { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          .modal-overlay { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          input, textarea { outline: none; transition: all 0.25s ease !important; }
          input:focus, textarea:focus { border-color: rgba(99,102,241,0.8) !important; box-shadow: 0 0 0 4px rgba(99,102,241,0.2) !important; background: rgba(255,255,255,0.08) !important; }
          ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
        `}</style>

        {/* Global layout (Navbar + Page Routing + Footer) */}
        <GlobalLayout 
          cartCount={cartCount} 
          setShowCart={setShowCart}
          currentUser={currentUser}
          setShowAuthModal={setShowAuthModal}
          setCurrentUser={setCurrentUser}
        >
          <Routes>
            <Route path="/" element={
              <Home 
                categories={categories}
                posts={posts}
                productCategories={productCategories}
                products={products}
                addToCart={addToCart}
                addedId={addedId}
              />
            } />
            <Route path="/product/:id" element={
              <ProductDetail 
                addToCart={addToCart}
                cart={cart}
                products={products}
                productCategories={productCategories}
              />
            } />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </GlobalLayout>

        {/* ── GLOBAL CART DRAWER ── */}
        {showCart && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }} />
            {/* Drawer */}
            <div className="cart-drawer" style={{ position: 'relative', width: '420px', maxWidth: '95vw', background: 'linear-gradient(180deg, #18162e 0%, #0d0c18 100%)', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', boxShadow: '-10px 0 40px rgba(0,0,0,0.5)' }}>
              {/* Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>🛒 Giỏ hàng của bạn</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{cartCount} sản phẩm trong giỏ</div>
                </div>
                <button onClick={() => setShowCart(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>✕</button>
              </div>

              {/* Items */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: 'rgba(255,255,255,0.6)' }}>Giỏ hàng trống</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Cửa hàng đang có nhiều sản phẩm mới cực chất!</div>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', padding: '14px', marginBottom: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <img src={item.imageUrl || 'https://picsum.photos/60/60'} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.05)' }} onError={e => e.target.src = 'https://picsum.photos/60/60'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '14.5px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(255,255,255,0.9)' }}>{item.name}</div>
                      <div style={{ color: '#ff6b8b', fontWeight: '800', fontSize: '14px' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ minWidth: '18px', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <button onClick={() => removeFromCart(item.id)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14.5px', fontWeight: '500' }}>Tổng giá trị:</span>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: '#ff6b8b', textShadow: '0 0 15px rgba(255,107,139,0.2)' }}>{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <button onClick={() => { setShowCart(false); setShowCheckout(true); }} style={{ width: '100%', padding: '15px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: '800', letterSpacing: '0.3px', boxShadow: '0 8px 25px rgba(99,102,241,0.35)', transition: 'transform 0.2s' }}>
                    💳 Đặt hàng ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GLOBAL CHECKOUT MODAL ── */}
        {showCheckout && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={closeCheckout} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
            <div className="modal-overlay" style={{ position: 'relative', width: '100%', maxWidth: '500px', background: 'linear-gradient(180deg, #18162e, #0c0b17)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
              {orderSuccess ? (
                /* Success state */
                <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'bounce 1s infinite' }}>🎉</div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Đặt hàng thành công!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Mã đơn hàng: <strong style={{ color: '#00c8ff' }}>#{orderSuccess.orderId}</strong></p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Tổng tiền thanh toán: <strong style={{ color: '#ff6b8b' }}>{orderSuccess.totalAmount?.toLocaleString('vi-VN')}₫</strong></p>
                  <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px', lineHeight: '1.5' }}>Đơn hàng đã được lưu liên kết với tài khoản **{currentUser?.fullName}**. Chúng tôi sẽ liên hệ giao hàng sớm nhất!</p>
                  <button onClick={closeCheckout} style={{ padding: '12px 36px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: '700', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>Quay lại cửa hàng</button>
                </div>
              ) : (
                /* Form state */
                <form onSubmit={handleCheckout}>
                  <div style={{ padding: '28px 28px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: '800' }}>📋 Thông tin đặt hàng</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{cartCount} sản phẩm · Tổng cộng: {cartTotal.toLocaleString('vi-VN')}₫</div>
                      </div>
                      <button type="button" onClick={closeCheckout} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>

                    {[
                      { key: 'fullName', label: 'Họ và tên *', placeholder: 'Nguyễn Văn A', type: 'text' },
                      { key: 'email', label: 'Email *', placeholder: 'example@gmail.com', type: 'email' },
                      { key: 'phone', label: 'Số điện thoại *', placeholder: '0901234567', type: 'text' },
                      { key: 'address', label: 'Địa chỉ giao hàng (Có thể chỉnh sửa) *', placeholder: '123 Đường ABC, Quận 9, TP.HCM', type: 'text' },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                        <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} required
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                      </div>
                    ))}

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ghi chú đơn hàng</label>
                      <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." rows={3}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                    </div>

                    {orderError && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>⚠️ {orderError}</div>}
                  </div>

                  <div style={{ padding: '20px 28px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '8px', display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => { setShowCheckout(false); setShowCart(true); }} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>← Giỏ hàng</button>
                    <button type="submit" disabled={ordering} style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', background: ordering ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: ordering ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                      {ordering ? '⏳ Đang đặt hàng...' : '✅ Xác nhận mua'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── 🔑 USER AUTHENTICATION MODAL (LOGIN/REGISTER) ── */}
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            {/* Backdrop */}
            <div onClick={() => { if (!authLoading) setShowAuthModal(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
            
            {/* Modal Box */}
            <div className="modal-overlay" style={{ position: 'relative', width: '100%', maxWidth: '450px', background: 'linear-gradient(180deg, #1c1a35, #0c0b17)', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
              
              {authMessage ? (
                /* Success Message State */
                <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '56px', marginBottom: '16px', animation: 'bounce 1s ease infinite' }}>✨</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: '#55efc4' }}>{authMessage}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Chào mừng bạn đến với thiên đường mua sắm DoanCMS!</p>
                </div>
              ) : (
                /* Form Inputs State */
                <div>
                  {/* Selector Tabs */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: authMode === 'login' ? '#00c8ff' : 'rgba(255,255,255,0.4)', borderBottom: authMode === 'login' ? '2px solid #00c8ff' : 'none', cursor: 'pointer', fontWeight: '800', fontSize: '15px', transition: 'all 0.3s' }}>ĐĂNG NHẬP</button>
                    <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: authMode === 'register' ? '#00c8ff' : 'rgba(255,255,255,0.4)', borderBottom: authMode === 'register' ? '2px solid #00c8ff' : 'none', cursor: 'pointer', fontWeight: '800', fontSize: '15px', transition: 'all 0.3s' }}>ĐĂNG KÝ</button>
                  </div>

                  <form onSubmit={handleAuthSubmit} style={{ padding: '28px' }}>
                    {/* Friendly Alert */}
                    {authError && authError.includes('bắt đầu mua sắm') && (
                      <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: '13px', marginBottom: '20px', lineHeight: '1.4' }}>
                        🛍️ <strong>Tính năng mua sắm:</strong> Quý khách cần đăng nhập tài khoản khách hàng để thêm sản phẩm vào giỏ hàng và quản lý đơn hàng.
                      </div>
                    )}

                    {authMode === 'register' && (
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Họ và tên *</label>
                        <input type="text" value={authForm.fullName} onChange={e => setAuthForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Nguyễn Văn A" required
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                      </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email *</label>
                      <input type="email" value={authForm.email} onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} placeholder="customer@gmail.com" required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    {authMode === 'register' && (
                      <>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số điện thoại</label>
                          <input type="text" value={authForm.phone} onChange={e => setAuthForm(p => ({ ...p, phone: e.target.value }))} placeholder="0901234567"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Địa chỉ giao hàng mặc định</label>
                          <input type="text" value={authForm.address} onChange={e => setAuthForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Đường ABC, Quận 9, TP.HCM"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                      </>
                    )}

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mật khẩu *</label>
                      <input type="password" value={authForm.password} onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    {authError && !authError.includes('bắt đầu mua sắm') && (
                      <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>
                        ⚠️ {authError}
                      </div>
                    )}

                    <button type="submit" disabled={authLoading} style={{
                      width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                      cursor: authLoading ? 'not-allowed' : 'pointer', fontSize: '14.5px', fontWeight: '800',
                      boxShadow: '0 8px 25px rgba(99,102,241,0.3)', transition: 'all 0.2s'
                    }}>
                      {authLoading ? '⏳ Đang xử lý...' : authMode === 'login' ? '🔑 Đăng nhập' : '📝 Đăng ký ngay'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </BrowserRouter>
  );
}

export default App;