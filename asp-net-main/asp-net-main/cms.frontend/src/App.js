import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PostDetail from './PostDetail';
import ProductDetail from './ProductDetail';

const API = 'https://localhost:7226';

// Component Logo riêng với animation và hiệu ứng
function Logo() {
  return (
    <div className="logo-container">
      <svg className="logo-svg" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f59e0b' }} />
            <stop offset="50%" style={{ stopColor: '#ef4444' }} />
            <stop offset="100%" style={{ stopColor: '#e879f9' }} />
          </linearGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#2d1b4e' }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6' }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4' }} />
          </linearGradient>
        </defs>
        
        {/* Con cá Koi cách điệu */}
        <g transform="translate(30, 30)">
          {/* Thân cá */}
          <path d="M0,0 Q15,-18 35,-10 Q55,-2 65,0 Q55,2 35,10 Q15,18 0,0 Z" 
                fill="url(#fishGrad)" 
                opacity="0.95"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"/>
          {/* Vây lưng */}
          <path d="M25,-12 Q32,-22 38,-12" 
                fill="rgba(245,158,11,0.7)" 
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"/>
          {/* Vây đuôi */}
          <path d="M65,0 Q78,-12 85,-8 Q75,0 85,8 Q78,12 65,0 Z" 
                fill="rgba(239,68,68,0.8)"/>
          {/* Mắt cá */}
          <circle cx="12" cy="-3" r="3" fill="white"/>
          <circle cx="11" cy="-3" r="1.5" fill="#1a1a2e"/>
          <circle cx="10.5" cy="-3.5" r="0.5" fill="white"/>
          {/* Vảy cá */}
          <path d="M20,-5 Q25,-12 30,-5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <path d="M30,-3 Q35,-10 40,-3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <path d="M40,-1 Q45,-8 50,-1" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          {/* Bong bóng */}
          <circle cx="5" cy="-8" r="2" fill="rgba(255,255,255,0.4)">
            <animate attributeName="cy" values="-8;-12;-8" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="2" cy="-12" r="1.5" fill="rgba(255,255,255,0.3)">
            <animate attributeName="cy" values="-12;-17;-12" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Chữ DoanCMS */}
        <text x="100" y="28" fontFamily="'Poppins', -apple-system, sans-serif" fontSize="26" fontWeight="800" fill="url(#textGrad)" letterSpacing="1">
          DoanCMS
          <animate attributeName="opacity" values="0.95;1;0.95" dur="3s" repeatCount="indefinite"/>
        </text>
        <text x="100" y="46" fontFamily="'Poppins', -apple-system, sans-serif" fontSize="10" fontWeight="600" fill="#8b5cf6" letterSpacing="2" opacity="0.7">
          AQUA & PET
        </text>
      </svg>
    </div>
  );
}

function Home({ categories, posts, productCategories, products, addToCart, addedId }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductCategory, setSelectedProductCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  const filtered = selectedCategory ? posts.filter(p => p.categoryId === selectedCategory) : posts;
  const filteredProducts = selectedProductCategory ? products.filter(p => p.categoryProductId === selectedProductCategory) : products;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1, rootMargin: '20px' });

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [posts, products, activeTab, selectedCategory, selectedProductCategory]);

  return (
    <div className="page-transition">
      <div style={{ textAlign: 'center', padding: '40px 20px 40px', position: 'relative', zIndex: 1 }}>
        
        {/* Stats Section */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'DANH MỤC BÀI VIẾT', value: categories.length, icon: '📚', gradient: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
            { label: 'BÀI VIẾT', value: posts.length, icon: '📝', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
            { label: 'DANH MỤC SẢN PHẨM', value: productCategories.length, icon: '🏷️', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
            { label: 'SẢN PHẨM', value: products.length, icon: '🐟', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' }
          ].map((s, idx) => (
            <div key={s.label} className="stat-card scroll-reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-glow" style={{ background: s.gradient }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>
        
        {/* TABS */}
        <div className="tab-container">
          {[
            { id: 'posts', label: '📰 Tin tức & Bài viết', count: posts.length },
            { id: 'products', label: '🐠 Cá cảnh & Thủy sinh', count: products.length }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`tab-content ${activeTab}`}>
          {activeTab === 'posts' && (
            <div className="fade-in-up">
              <div className="filter-section">
                <div className="filter-header">
                  <span>🔖</span> LỌC THEO DANH MỤC BÀI VIẾT
                </div>
                <div className="filter-pills">
                  <button 
                    className={`filter-pill ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tất cả
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="result-count">
                  <span className="count-number">{filtered.length}</span> BÀI VIẾT
                </div>
              </div>
              
              <div className="posts-grid">
                {filtered.map((post, i) => (
                  <div 
                    key={post.id} 
                    className="post-card glass-card scroll-reveal"
                    onClick={() => navigate(`/post/${post.id}`)}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="card-image">
                      <img src={post.imageUrl || `https://picsum.photos/400/20${i % 10}`} alt={post.title} />
                      <span className="card-category">{post.category?.name || 'Tin tức'}</span>
                    </div>
                    <div className="card-content">
                      <h3>{post.title}</h3>
                      <p>📅 {new Date(post.createdDate).toLocaleDateString('vi-VN')}</p>
                      <span className="read-more">Đọc tiếp →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="fade-in-up">
              <div className="filter-section">
                <div className="filter-header">
                  <span>🐟</span> LỌC THEO DANH MỤC SẢN PHẨM
                </div>
                <div className="filter-pills">
                  <button 
                    className={`filter-pill ${selectedProductCategory === null ? 'active' : ''}`}
                    onClick={() => setSelectedProductCategory(null)}
                  >
                    Tất cả sản phẩm
                  </button>
                  {productCategories.map(cat => (
                    <button 
                      key={cat.id} 
                      className={`filter-pill ${selectedProductCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedProductCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="result-count">
                  <span className="count-number">{filteredProducts.length}</span> SẢN PHẨM
                </div>
              </div>
              
              <div className="products-grid">
                {filteredProducts.map((product, i) => (
                  <div 
                    key={product.id} 
                    className="product-card glass-card scroll-reveal"
                    onClick={(e) => {
                      if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                        navigate(`/product/${product.id}`);
                      }
                    }}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="card-image">
                      <img src={product.imageUrl || `https://picsum.photos/400/22${i % 10}`} alt={product.name} />
                      <span className="card-category product-cat">{product.categoryProduct?.name || 'Sản phẩm'}</span>
                      {product.stockQuantity <= 0 && (
                        <div className="sold-out">Hết hàng</div>
                      )}
                    </div>
                    
                    <div className="card-content">
                      <h3>{product.name}</h3>
                      <p>{product.description?.slice(0, 60) || 'Không có mô tả chi tiết.'}...</p>
                      
                      <div className="price-stock">
                        <span className="product-price">{product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}</span>
                        <span className={`stock-badge ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
                          {product.stockQuantity > 0 ? `📦 Còn: ${product.stockQuantity}` : '❌ Hết hàng'}
                        </span>
                      </div>

                      <button
                        className="add-to-cart-btn"
                        disabled={product.stockQuantity <= 0}
                        onClick={() => addToCart(product)}
                      >
                        {addedId === product.id ? (
                          <span>✅ Đã thêm!</span>
                        ) : product.stockQuantity <= 0 ? (
                          <span>🚫 Hết hàng</span>
                        ) : (
                          <span>🛒 Thêm vào giỏ</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlobalLayout({ children, cartCount, setShowCart, currentUser, setShowAuthModal, setCurrentUser }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <nav className={`navbar-glass ${scrolled ? 'scrolled' : ''}`}>
        <Logo />
        
        <div className="nav-actions">
          {currentUser ? (
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">Chào, {currentUser.fullName}</span>
              <button onClick={() => { setCurrentUser(null); localStorage.removeItem('doan_cms_user'); }} className="logout-btn">
                Đăng xuất
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="login-btn">
              🔑 Đăng nhập
            </button>
          )}
          <button onClick={() => setShowCart(true)} className="cart-btn">
            🛒 Giỏ hàng
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
      <footer className="footer-glass">
        <p>© 2026 DoanCMS · Trần Văn Đoàn · MSSV: 2123110210 · CCQ2311F · Cao Đẳng Công Thương TPHCM</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('doan_cms_user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('doan_cms_cart') || '[]'));
  const [showCart, setShowCart] = useState(false);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/categoryapi`).then(r => r.json()),
      fetch(`${API}/api/postapi`).then(r => r.json()),
      fetch(`${API}/api/categoryproductapi`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/productapi`).then(r => r.json()).catch(() => [])
    ]).then(([cats, ps, prodCats, prods]) => {
      setCategories(cats); setPosts(ps); setProductCategories(prodCats); setProducts(prods); setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  useEffect(() => { localStorage.setItem('doan_cms_cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (product) => {
    if (!currentUser) {
      setAuthMode('login'); setAuthError('Vui lòng đăng nhập để bắt đầu mua sắm!'); setShowAuthModal(true); return;
    }
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) {
        if (exist.quantity >= product.stockQuantity) return prev;
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity: 1, stock: product.stockQuantity }];
    });
    setAddedId(product.id); setTimeout(() => setAddedId(null), 1200);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault(); setAuthError(''); setAuthMessage('');
    const url = authMode === 'login' ? `${API}/api/customerapi/login` : `${API}/api/customerapi/register`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data); localStorage.setItem('doan_cms_user', JSON.stringify(data));
        setAuthMessage('Thành công!'); setTimeout(() => setShowAuthModal(false), 1000);
      } else { setAuthError(data.message || 'Thao tác thất bại!'); }
    } catch { setAuthError('Lỗi kết nối server!'); }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            background: url('https://www.transparenttextures.com/patterns/wood-pattern.png'), 
                        linear-gradient(135deg, #c8a882 0%, #b8956e 30%, #a0784c 60%, #8b653b 100%);
            background-blend-mode: overlay;
            min-height: 100vh;
          }

          .app-container {
            min-height: 100vh;
            background: transparent;
          }

          /* Logo */
          .logo-container {
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .logo-container:hover {
            transform: scale(1.02);
          }
          
          .logo-svg {
            width: 220px;
            height: 60px;
          }

          /* Navbar - CỰC KỲ TRONG SUỐT để thấy vân gỗ */
          .navbar-glass {
            position: sticky;
            top: 0;
            z-index: 200;
            background: rgba(255, 248, 235, 0.1);
            backdrop-filter: blur(6px) saturate(120%);
            -webkit-backdrop-filter: blur(6px) saturate(120%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 12px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .navbar-glass.scrolled {
            background: rgba(255, 248, 235, 0.15);
            backdrop-filter: blur(8px) saturate(140%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.25);
          }

          /* Glass Card - TRONG SUỐT NHƯ KÍNH THẬT */
          .glass-card {
            background: rgba(255, 248, 235, 0.08);
            backdrop-filter: blur(4px) saturate(110%);
            -webkit-backdrop-filter: blur(4px) saturate(110%);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            cursor: pointer;
          }

          .glass-card:hover {
            background: rgba(255, 248, 235, 0.15);
            backdrop-filter: blur(6px) saturate(120%);
            border-color: rgba(255, 255, 255, 0.35);
            transform: translateY(-8px);
            box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
          }

          /* Stat Cards */
          .stat-card {
            position: relative;
            background: rgba(255, 248, 235, 0.06);
            backdrop-filter: blur(3px);
            border: 1px solid rgba(255,255,255,0.15);
            padding: 18px 24px;
            border-radius: 20px;
            text-align: center;
            min-width: 120px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            background: rgba(255, 248, 235, 0.12);
            transform: translateY(-4px);
            border-color: rgba(255,255,255,0.25);
          }

          .stat-icon {
            font-size: 28px;
            margin-bottom: 6px;
          }

          .stat-value {
            font-size: 34px;
            font-weight: 800;
            background: linear-gradient(135deg, #2d1b4e, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            line-height: 1.1;
          }

          .stat-label {
            font-size: 9px;
            letter-spacing: 2px;
            color: #2d1b4e;
            margin-top: 6px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .stat-glow {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            opacity: 0.5;
          }

          /* Tab Container */
          .tab-container {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 40px;
            background: rgba(255, 248, 235, 0.08);
            backdrop-filter: blur(8px);
            border-radius: 100px;
            padding: 6px;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            border: 1px solid rgba(255,255,255,0.15);
          }

          .tab-pill {
            padding: 12px 28px;
            border-radius: 100px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            background: transparent;
            color: #2d1b4e;
            font-family: 'Poppins', sans-serif;
          }

          .tab-pill.active {
            color: white;
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            box-shadow: 0 4px 15px rgba(99,102,241,0.3);
          }

          .tab-count {
            background: rgba(0,0,0,0.08);
            padding: 2px 8px;
            border-radius: 100px;
            font-size: 11px;
            margin-left: 8px;
          }

          .tab-pill.active .tab-count {
            background: rgba(255,255,255,0.25);
          }

          /* Filter Section */
          .filter-section {
            margin-bottom: 32px;
          }

          .filter-header {
            font-size: 10px;
            letter-spacing: 3px;
            color: #2d1b4e;
            margin-bottom: 16px;
            text-transform: uppercase;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .filter-pills {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .filter-pill {
            padding: 8px 20px;
            border-radius: 100px;
            border: 1px solid rgba(255,255,255,0.2);
            cursor: pointer;
            background: rgba(255, 248, 235, 0.1);
            backdrop-filter: blur(4px);
            color: #2d1b4e;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s ease;
            font-family: 'Poppins', sans-serif;
          }

          .filter-pill:hover {
            background: rgba(255, 248, 235, 0.2);
            border-color: rgba(255,255,255,0.35);
          }

          .filter-pill.active {
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            border-color: transparent;
          }

          .result-count {
            font-size: 10px;
            letter-spacing: 2px;
            color: #2d1b4e;
            text-transform: uppercase;
            font-weight: 700;
          }

          .count-number {
            font-size: 18px;
            font-weight: 800;
            margin-right: 6px;
            color: #e11d48;
          }

          /* Grid Layouts */
          .posts-grid, .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 28px;
          }

          /* Card Images */
          .card-image {
            position: relative;
            height: 200px;
            overflow: hidden;
          }

          .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .glass-card:hover .card-image img {
            transform: scale(1.05);
          }

          .card-category {
            position: absolute;
            bottom: 12px;
            left: 12px;
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            padding: 4px 14px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 600;
            backdrop-filter: blur(4px);
          }

          .product-cat {
            background: linear-gradient(135deg, #06b6d4, #6366f1);
          }

          .sold-out {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 16px;
          }

          .card-content {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .card-content h3 {
            margin: 0 0 8px;
            font-size: 17px;
            font-weight: 700;
            color: #1a0f2e;
            line-height: 1.4;
          }

          .card-content p {
            margin: 0 0 16px;
            font-size: 12px;
            color: #3d2d5a;
            line-height: 1.5;
          }

          .read-more {
            font-size: 11px;
            color: #8b5cf6;
            font-weight: 600;
            margin-top: auto;
          }

          .price-stock {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .product-price {
            font-size: 18px;
            font-weight: 800;
            color: #e11d48;
          }

          .stock-badge {
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 8px;
            font-weight: 600;
          }

          .stock-badge.in-stock {
            background: rgba(16, 185, 129, 0.15);
            color: #10b981;
          }

          .stock-badge.out-stock {
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
          }

          .add-to-cart-btn {
            width: 100%;
            padding: 12px;
            border-radius: 14px;
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            font-weight: 700;
            font-size: 13px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Poppins', sans-serif;
          }

          .add-to-cart-btn:hover:not(:disabled) {
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(99,102,241,0.3);
          }

          .add-to-cart-btn:disabled {
            background: #cbd5e1;
            cursor: not-allowed;
          }

          /* Navigation Actions */
          .nav-actions {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 248, 235, 0.12);
            backdrop-filter: blur(4px);
            padding: 6px 16px;
            border-radius: 100px;
            border: 1px solid rgba(255,255,255,0.15);
          }

          .user-name {
            font-size: 13px;
            font-weight: 600;
            color: #1a0f2e;
          }

          .logout-btn, .login-btn, .cart-btn {
            background: rgba(255, 248, 235, 0.12);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 18px;
            border-radius: 100px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            color: #1a0f2e;
          }

          .login-btn {
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            border: none;
          }

          .cart-btn {
            background: linear-gradient(135deg, #06b6d4, #6366f1);
            color: white;
            border: none;
            position: relative;
          }

          .cart-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #ef4444;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 100px;
            font-weight: 700;
          }

          .logout-btn:hover {
            background: rgba(255, 248, 235, 0.25);
          }

          /* Footer */
          .footer-glass {
            text-align: center;
            padding: 40px 20px;
            background: rgba(255, 248, 235, 0.08);
            backdrop-filter: blur(4px);
            border-top: 1px solid rgba(255,255,255,0.12);
            color: #2d1b4e;
            font-size: 12px;
            font-weight: 500;
          }

          /* Animations */
          .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          }

          .scroll-reveal.reveal-active {
            opacity: 1;
            transform: translateY(0);
          }

          .fade-in-up {
            animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .page-transition {
            animation: pageEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pageEnter {
            from {
              opacity: 0;
              transform: scale(0.98);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .main-content {
            min-height: 80vh;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .navbar-glass {
              padding: 12px 20px;
              flex-direction: column;
              gap: 12px;
            }
            
            .logo-svg {
              width: 180px;
              height: 50px;
            }
            
            .nav-actions {
              width: 100%;
              justify-content: center;
            }
            
            .posts-grid, .products-grid {
              grid-template-columns: 1fr;
            }
            
            .tab-container {
              padding: 4px;
            }
            
            .tab-pill {
              padding: 8px 16px;
              font-size: 12px;
            }
          }
        `}</style>

        <GlobalLayout 
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          setShowCart={setShowCart} 
          currentUser={currentUser} 
          setShowAuthModal={setShowAuthModal} 
          setCurrentUser={setCurrentUser}
        >
          <Routes>
            <Route path="/" element={<Home categories={categories} posts={posts} productCategories={productCategories} products={products} addToCart={addToCart} addedId={addedId} />} />
            <Route path="/post/:id" element={<PostDetail api={API} />} />
            <Route path="/product/:id" element={<ProductDetail api={API} />} />
          </Routes>
        </GlobalLayout>

        {/* Auth Modal */}
        {showAuthModal && (
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.3)', 
            backdropFilter: 'blur(12px)', 
            zIndex: 999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <div style={{ 
              background: 'rgba(255, 248, 235, 0.85)', 
              backdropFilter: 'blur(20px)', 
              padding: '36px', 
              borderRadius: '32px', 
              width: '100%', 
              maxWidth: '420px',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
              <h2 style={{ margin: '0 0 24px', textAlign: 'center', fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #2d1b4e, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {authMode === 'login' ? '🔑 Đăng Nhập' : '🎉 Đăng Ký'}
              </h2>
              
              {authError && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '12px' }}>{authError}</div>}
              {authMessage && <div style={{ color: '#10b981', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textAlign: 'center', background: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '12px' }}>{authMessage}</div>}
              
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {authMode === 'register' && (
                  <input 
                    type="text" 
                    placeholder="Họ và tên" 
                    required 
                    style={{ padding: '14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }} 
                    value={authForm.fullName} 
                    onChange={e => setAuthForm({...authForm, fullName: e.target.value})} 
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  style={{ padding: '14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }} 
                  value={authForm.email} 
                  onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                />
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  required 
                  style={{ padding: '14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', fontSize: '14px', fontFamily: 'Poppins, sans-serif' }} 
                  value={authForm.password} 
                  onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                />
                <button type="submit" style={{ 
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '14px', 
                  cursor: 'pointer', 
                  fontWeight: '700',
                  fontSize: '15px',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  Xác nhận
                </button>
              </form>
              
              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px' }}>
                <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ color: '#8b5cf6', cursor: 'pointer', fontWeight: '600' }}>
                  {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                </span>
              </div>
              
              <button onClick={() => setShowAuthModal(false)} style={{ 
                width: '100%', 
                marginTop: '16px', 
                background: 'rgba(0,0,0,0.05)', 
                border: 'none', 
                padding: '10px',
                borderRadius: '12px',
                color: '#64748b', 
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}