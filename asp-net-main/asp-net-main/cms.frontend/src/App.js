import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PostDetail from './PostDetail';
import ProductDetail from './ProductDetail';
import Profile from './Profile';
import './liquid-glass.css';

const POTENTIAL_APIS = [
  'https://localhost:7226',
  'http://localhost:5173',
  'http://localhost:5000',
  'https://localhost:44351',
  'http://localhost:40064'
];

let API = localStorage.getItem('doan_cms_api_url') || process.env.REACT_APP_API_URL || 'https://localhost:7226';

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const activeApi = localStorage.getItem('doan_cms_api_url') || API;
  return `${activeApi}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Reusable product row for homepage sections (3 cards each)
function ProductRow({ title, subtitle, icon, colorAccent, products, addToCart, addedId, navigate, viewAllLink }) {
  return (
    <div className="home-product-section" style={{ marginBottom: '60px' }}>
      <div className="red-section-header">
        <div className="red-section-icon">{icon}</div>
        <h2 className="red-section-title">{title}</h2>
        <button style={{ marginLeft: 'auto', background: '#dc2626', border: 'none', color: 'white', padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate(viewAllLink)}>
          XEM THÊM
        </button>
      </div>

      <div className="products-grid home-products-grid-3">
        {products.map((product, i) => {
          const isAccessory = product.categoryProductId === 4;
          const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
          return (
            <div
              key={product.id}
              className="product-card"
              onClick={(e) => {
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                  navigate(`/product/${product.id}`);
                }
              }}
            >
              <div className="card-image-wrapper">
                <img src={resolveImageUrl(product.imageUrl) || `https://picsum.photos/400/22${i % 10}`} alt={product.name} />
                {isLowStock && (
                  <span className="stock-badge-hot">
                    Bán chạy / Còn {product.stockQuantity} {isAccessory ? 'chiếc' : 'con'}
                  </span>
                )}
                {product.stockQuantity <= 0 && (
                  <div className="sold-out-overlay">Hết hàng</div>
                )}
              </div>
              <div className="card-content">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price-label">
                  {product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}
                </div>
                <div className="card-actions-row">
                  <button className="btn-action-info" onClick={() => navigate(`/product/${product.id}`)}>
                    <span style={{ fontSize: '11px' }}>ℹ️</span> Chi tiết
                  </button>
                  <button
                    className="btn-action-buy"
                    disabled={product.stockQuantity <= 0}
                    onClick={() => addToCart(product)}
                  >
                    {addedId === product.id ? (
                      <span>✅ Đã thêm!</span>
                    ) : product.stockQuantity <= 0 ? (
                      <span>🚫 Hết</span>
                    ) : (
                      <span>🛒 Mua ngay</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Home({ categories, posts, productCategories, products, banners: dbBanners, addToCart, addedId, searchTerm, setSelectedCat }) {
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      image: "/aquarium_fish_banner.png",
      badge: "🐠 Cửa hàng cá cảnh uy tín #1 TPHCM",
      title1: "Thế Giới Cá Cảnh",
      title2: "Đẳng Cấp & Tươi Đẹp",
      desc: "Hàng nghìn loài cá cảnh, thiết bị thủy sinh và phụ kiện cao cấp. Giao hàng nhanh, cam kết chất lượng."
    },
    {
      id: 2,
      image: "/aquascape_banner.png",
      badge: "🌿 Thủy Sinh Tự Nhiên",
      title1: "Hệ Sinh Thái",
      title2: "Thu Nhỏ Trong Nhà",
      desc: "Chuyên cung cấp các loại cây thủy sinh, bố cục tiểu cảnh chuẩn phong cách Nature Aquarium."
    },
    {
      id: 3,
      image: "/aquarium_equipment_banner.png",
      badge: "⚡ Thiết Bị Chuyên Nghiệp",
      title1: "Phụ Kiện Bể Cá",
      title2: "Chính Hãng 100%",
      desc: "Hệ thống lọc, đèn LED, máy sủi oxy và các trang thiết bị nhập khẩu từ các thương hiệu uy tín."
    }
  ];

  const displayBanners = dbBanners && dbBanners.length > 0 ? dbBanners : banners;

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % displayBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  // Mới nhất: sort by id desc, take 3
  const newestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 3);

  // Bán chạy: in-stock sorted by stockQuantity asc (least stock = most sold), take 3
  const bestSellers = [...products]
    .filter(p => p.stockQuantity > 0)
    .sort((a, b) => a.stockQuantity - b.stockQuantity)
    .slice(0, 3);

  // Nổi bật: sorted by price desc (highest value = most premium), take 3
  const featuredProducts = [...products]
    .filter(p => p.stockQuantity > 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  return (
    <div className="page-transition">

      {/* Hero Banner */}
      <div className="hero-banner-section" style={{ position: 'relative' }}>
        {displayBanners.map((b, index) => (
          <div 
            key={b.id} 
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === currentBanner ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: index === currentBanner ? 1 : 0,
              pointerEvents: index === currentBanner ? 'auto' : 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="hero-banner-overlay" style={{ background: `url('${resolveImageUrl(b.imageUrl || b.image)}') center/cover no-repeat`, opacity: 0.15 }} />
            <div className="hero-banner-inner" style={{ height: '100%', position: 'absolute', inset: 0 }}>
              <div className="hero-content">
                <div className="hero-badge">{b.badge}</div>
                <h1 className="hero-title">{b.title1}<br /><span>{b.title2}</span></h1>
                <p className="hero-desc">{b.desc}</p>
                <div className="hero-cta-row">
                  <button className="hero-btn-primary" onClick={() => navigate('/shop')}>🛍️ Khám phá cửa hàng</button>
                  <button className="hero-btn-secondary" onClick={() => navigate('/blog')}>📖 Xu hướng mới</button>
                </div>
              </div>
              <div className="hero-fish-deco">
                <span className="fish-float f1">🐠</span>
                <span className="fish-float f2">🐟</span>
                <span className="fish-float f3">🐡</span>
              </div>
            </div>
          </div>
        ))}
        {/* Placeholder to keep height responsive */}
        <div className="hero-banner-inner" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
          <div className="hero-content">
            <div className="hero-badge">Placeholder text longer to wrap on small screens</div>
            <h1 className="hero-title">Placeholder Title<br /><span>Placeholder Subtitle</span></h1>
            <p className="hero-desc">This is a long placeholder description that ensures the height of the banner stays consistent no matter what screen size.</p>
            <div className="hero-cta-row">
              <button className="hero-btn-primary">Placeholder</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Benefits Row */}
      <div className="benefits-row">
        <div className="benefit-item">
          <div className="benefit-icon">🚚</div>
          <div className="benefit-text">
            <h4>Giao Hàng Tận Nơi</h4>
            <p>Liên kết với các đơn vị vận chuyển uy tín, đảm bảo</p>
          </div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">💳</div>
          <div className="benefit-text">
            <h4>Thanh Toán Tiện Lợi</h4>
            <p>Hỗ trợ thanh toán tiền mặt hoặc thẻ từ các ngân hàng</p>
          </div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🎧</div>
          <div className="benefit-text">
            <h4>Hỗ Trợ Khách Hàng</h4>
            <p>Chăm sóc khách hàng 24/7. Giải đáp mọi thắc mắc</p>
          </div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🎖️</div>
          <div className="benefit-text">
            <h4>Sản Phẩm Chính Hãng</h4>
            <p>Sản phẩm chính hãng đến từ các thương hiệu uy tín</p>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-section">
        <div className="about-content">
          <h2>Tổng quan về chúng tôi</h2>
          <p>THỦY SINH XANH được thành lập từ năm 2020. Hiện tại, Cửa hàng chúng tôi đang hoạt động chính ở khu vực Tp. Hồ Chí Minh và một số tỉnh ở miền Nam Việt Nam. Chúng tôi kinh doanh, phân phối các thiết bị liên quan đến Thuỷ sinh, nuôi cá cảnh, tép cảnh. Thuỷ sinh xanh còn nhận tư vấn, lắp đặt các bể cá thuỷ sinh trong nhà, ngoài trời. Lắp đặt và xây dựng bể cá koi, cá rồng trong nhà, quán cà phê, nhà hàng, khách sạn.</p>
          <p>Mong muốn của chúng tôi là mang thiên nhiên đến gần bạn hơn, giúp cuộc sống của bạn trở nên thực sự thư giãn, thoải mái sau những giờ làm việc cực nhọc. Chúng tôi luôn làm việc với triết lý "thuỷ sinh phục vụ cuộc sống", chính vì vậy mà sản phẩm của chúng tôi tạo ra luôn đơn giản, dễ sử dụng nhất nhưng cũng rất đẹp dành cho khách hàng của mình.</p>
          <button className="btn-readmore-red" onClick={() => navigate('/blog')}>XEM THÊM</button>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1524704654690-b56c05c78a02?w=800&auto=format&fit=crop&q=80" alt="Cửa hàng Thủy Sinh" />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Section: Mới nhất */}
        {newestProducts.length > 0 && (
          <ProductRow
            title="SẢN PHẨM GIÁ TỐT"
            subtitle=""
            icon="🏷️"
            colorAccent="#ef4444"
            products={newestProducts}
            addToCart={addToCart}
            addedId={addedId}
            navigate={navigate}
            viewAllLink="/shop"
          />
        )}

        {/* Decorative middle banner */}
        <div style={{ margin: '40px 0', borderRadius: '12px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80" alt="Banner" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        </div>

        {/* Section: Bán chạy */}
        {bestSellers.length > 0 && (
          <ProductRow
            title="TOP SẢN PHẨM BÁN CHẠY"
            subtitle=""
            icon="★"
            colorAccent="#ef4444"
            products={bestSellers}
            addToCart={addToCart}
            addedId={addedId}
            navigate={navigate}
            viewAllLink="/shop"
          />
        )}

        {/* Section: Nổi bật */}
        {featuredProducts.length > 0 && (
          <ProductRow
            title="SẢN PHẨM NỔI BẬT"
            subtitle=""
            icon="⭐"
            colorAccent="#ef4444"
            products={featuredProducts}
            addToCart={addToCart}
            addedId={addedId}
            navigate={navigate}
            viewAllLink="/shop"
          />
        )}

      </div>
    </div>
  );
}

// ===================== TRANG CỬA HÀNG =====================
function Shop({ productCategories, products, addToCart, addedId, searchTerm, selectedCat, setSelectedCat }) {
  const navigate = useNavigate();

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCat ? p.categoryProductId === selectedCat : true;
    const matchesSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-transition">
      {/* Shop Hero */}
      <div className="shop-hero">
        <div className="shop-hero-inner">
          <h1 className="shop-hero-title">🏪 Sản Phẩm</h1>
          <p className="shop-hero-sub">Khám phá toàn bộ sản phẩm cá cảnh &amp; thiết bị thủy sinh</p>
        </div>
      </div>

      {/* Category Filter Pills - horizontal scroll, NO page scroll leak */}
      <div className="shop-cat-strip-wrapper">
        <div className="shop-cat-strip">
          <button
            className={`shop-cat-pill${!selectedCat ? ' active' : ''}`}
            onClick={() => setSelectedCat(null)}
          >
            <span className="pill-emoji">🐟</span>
            <span>Tất cả</span>
          </button>
          {productCategories.map(cat => {
            const nl = (cat.name || '').toLowerCase();
            let emoji = '🐠';
            if (nl.includes('phụ kiện') || nl.includes('thiết bị')) emoji = '⚙️';
            else if (nl.includes('thủy sinh') || nl.includes('cây')) emoji = '🌿';
            else if (nl.includes('thức ăn') || nl.includes('ăn')) emoji = '🥣';
            else if (nl.includes('bể') || nl.includes('hồ') || nl.includes('tank')) emoji = '🪣';
            return (
              <button
                key={cat.id}
                className={`shop-cat-pill${selectedCat === cat.id ? ' active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                <span className="pill-emoji">{emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* Result count */}
        <div className="shop-result-bar">
          <span>Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm
            {selectedCat && productCategories.find(c => c.id === selectedCat) && (
              <span style={{ color: '#3b82f6', fontWeight: '700' }}> · {productCategories.find(c => c.id === selectedCat).name}</span>
            )}
          </span>
          {(selectedCat || searchTerm) && (
            <button className="shop-clear-filter" onClick={() => setSelectedCat(null)}>✕ Xoá bộ lọc</button>
          )}
        </div>

        {/* Products Grid */}
        <div id="products-section">
          <div className="products-grid">
            {filteredProducts.map((product, i) => {
              const isAccessory = product.categoryProductId === 4;
              const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={(e) => {
                    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                      navigate(`/product/${product.id}`);
                    }
                  }}
                >
                  <div className="card-image-wrapper">
                    <img src={resolveImageUrl(product.imageUrl) || `https://picsum.photos/400/22${i % 10}`} alt={product.name} />
                    {isLowStock && (
                      <span className="stock-badge-hot">
                        Bán chạy / Còn {product.stockQuantity} {isAccessory ? 'chiếc' : 'con'}
                      </span>
                    )}
                    {product.stockQuantity <= 0 && (
                      <div className="sold-out-overlay">Hết hàng</div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price-label">
                      {product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}
                    </div>
                    <div className="card-actions-row">
                      <button className="btn-action-info" onClick={() => navigate(`/product/${product.id}`)}>
                        <span style={{ fontSize: '11px' }}>ℹ️</span> Chi tiết
                      </button>
                      <button
                        className="btn-action-buy"
                        disabled={product.stockQuantity <= 0}
                        onClick={() => addToCart(product)}
                      >
                        {addedId === product.id ? (
                          <span>✅ Đã thêm!</span>
                        ) : product.stockQuantity <= 0 ? (
                          <span>🚫 Hết</span>
                        ) : (
                          <span>🛒 Mua ngay</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '15px', fontWeight: '600' }}>Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Blog({ categories, posts, searchTerm }) {
  const [selectedPostCat, setSelectedPostCat] = useState(null);
  const navigate = useNavigate();

  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedPostCat ? post.categoryId === selectedPostCat : true;
    const matchesSearch = searchTerm ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-transition">
      {/* Blog Hero */}
      <div className="shop-hero" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' }}>
        <div className="shop-hero-inner">
          <h1 className="shop-hero-title">📰 Tin Tức &amp; Blog</h1>
          <p className="shop-hero-sub">Chia sẻ kinh nghiệm chăm sóc cá cảnh và xu hướng thủy sinh mới nhất</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Post Category Filter */}
        <div className="category-tabs-container">
          <div
            className={`cat-tab-pill ${selectedPostCat === null ? 'active' : ''}`}
            onClick={() => setSelectedPostCat(null)}
            style={{ width: '130px' }}
          >
            <div className="cat-img-wrapper" style={{ borderRadius: '12px', width: '60px', height: '60px' }}>
              <img src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=150&auto=format&fit=crop&q=80" alt="Tất cả" />
            </div>
            <span className="cat-name">Tất cả bài viết</span>
          </div>
          {categories.map(cat => {
            let fallbackImg = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150&auto=format&fit=crop&q=80";
            const nl = cat.name ? cat.name.toLowerCase() : '';
            if (nl.includes('thời trang') || nl.includes('quần áo') || nl.includes('váy') || nl.includes('nữ') || nl.includes('nam')) {
              fallbackImg = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&auto=format&fit=crop&q=80";
            } else if (nl.includes('giày') || nl.includes('dép') || nl.includes('shoes')) {
              fallbackImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80";
            } else if (nl.includes('phụ kiện') || nl.includes('accessories')) {
              fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80";
            } else if (nl.includes('cá') || nl.includes('hồ') || nl.includes('bể') || nl.includes('thủy sinh') || nl.includes('fish')) {
              fallbackImg = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&auto=format&fit=crop&q=80";
            }
            return (
              <div
                key={cat.id}
                className={`cat-tab-pill ${selectedPostCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedPostCat(cat.id)}
                style={{ width: '130px' }}
              >
                <div className="cat-img-wrapper" style={{ borderRadius: '12px', width: '60px', height: '60px' }}>
                  <img src={fallbackImg} alt={cat.name} />
                </div>
                <span className="cat-name">{cat.name}</span>
              </div>
            );
          })}
        </div>

        {/* Result Count */}
        <div className="shop-result-bar">
          <span>Hiển thị <strong>{filteredPosts.length}</strong> bài viết</span>
          {selectedPostCat && (
            <button className="shop-clear-filter" onClick={() => setSelectedPostCat(null)}>✕ Xoá bộ lọc</button>
          )}
        </div>

        {/* Posts Grid */}
        <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {filteredPosts.map((post, i) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className="post-card-image">
                <img src={resolveImageUrl(post.imageUrl) || `https://picsum.photos/400/20${i % 10}`} alt={post.title} />
                <span className="post-card-category">{post.category?.name || 'Tin tức'}</span>
              </div>
              <div className="post-card-content">
                <span className="post-date">📅 {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                <h3>{post.title}</h3>
                <p>{post.summary || 'Tìm hiểu các kiến thức và mẹo chăm sóc thú cưng/thủy sinh hữu ích nhất tại đây...'}</p>
                <span className="post-readmore">Đọc bài viết ➔</span>
              </div>
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '15px', fontWeight: '600' }}>Không tìm thấy bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GlobalLayout({ children, cart, setCart, cartCount, showCart, setShowCart, currentUser, setShowAuthModal, setAuthMode, setCurrentUser, searchTerm, setSearchTerm, productCategories = [], setSelectedCat, showToast, theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Reset searchTerm khi chuyển trang (trừ trang /shop)
  useEffect(() => {
    if (location.pathname !== '/shop') {
      setSearchTerm('');
    }
  }, [location.pathname, setSearchTerm]);

  // Scroll to targeted section
  const handleNavClick = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Update quantity of item in cart
  const updateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        if (newQty > item.stock) return item; // limit to stock
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Checkout Handler
  const handleCheckout = async () => {
    if (!currentUser) {
      setShowCart(false);
      setShowAuthModal(true);
    setAuthMode('login');
      showToast('Vui lòng đăng nhập để thực hiện thanh toán!', 'error');
      return;
    }

    const payload = {
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone || '0901234567',
      address: currentUser.address || 'Hồ Chí Minh',
      notes: 'Đơn hàng đặt từ website Aqua Store',
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch(`${API}/api/orderapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`🎉 Đặt hàng thành công! Mã đơn hàng: #${data.orderId}`, 'success');
        setCart([]);
        setShowCart(false);
      } else {
        showToast(`❌ Lỗi đặt hàng: ${data.message || 'Thất bại'}`, 'error');
      }
    } catch {
      showToast('❌ Lỗi kết nối đến máy chủ!', 'error');
    }
  };

  return (
    <div>
      {/* Top Bar Contacts */}
      <div className="top-bar-strip">
        <div className="top-bar-inner">
          <div className="top-bar-left">
            <span>📞 Hotline: 1900 1234</span>
            <span style={{ margin: '0 12px', opacity: 0.5 }}>|</span>
            <span>✉️ Email: support@doancms.aqua</span>
          </div>
          <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {currentUser ? (
              <div className="top-user-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="top-action-btn" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'rgba(255, 255, 255, 0.08)', 
                    padding: '4px 12px', 
                    borderRadius: '100px',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    transition: 'all 0.2s ease',
                    fontWeight: '700'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="Avatar" 
                      style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '800',
                      color: 'white',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                    }}>
                      {currentUser.fullName ? currentUser.fullName.substring(0, 1).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span>{currentUser.fullName}</span>
                </button>
                <span style={{ opacity: 0.3, color: '#94a3b8' }}>|</span>
                <button onClick={() => { setCurrentUser(null); localStorage.removeItem('doan_cms_user'); }} className="top-action-btn" style={{ fontWeight: '600' }}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="top-user-wrap">
                <button onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} className="top-action-btn">Đăng nhập</button>
                <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                <button onClick={() => { setShowAuthModal(true); setAuthMode('register'); }} className="top-action-btn">Đăng ký</button>
              </div>
            )}
            <button 
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
              className="top-action-btn" 
              style={{ 
                fontSize: '14px', 
                background: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Chuyển chế độ Sáng/Tối"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header with Search and Logo */}
      <header className="main-header-glass">
        <div className="header-inner">
          <div className="logo-brand-wrap" onClick={() => handleNavClick('top')}>
            <span className="logo-main">DoanCMS</span>
            <span className="logo-sub">.Aqua</span>
          </div>
          
          <div className="search-bar-wrapper">
            <input 
              type="text" 
              placeholder="Tìm kiếm cá cảnh, thủy sinh, phụ kiện..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍</button>
          </div>

          <div className="header-actions">
            <button onClick={() => setShowCart(true)} className="header-cart-btn">
              <span className="cart-icon-wrapper">
                🛒
                <span className="cart-badge-count">{cartCount}</span>
              </span>
              <span className="cart-text-label">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Menu Bar */}
      <nav className="nav-menu-bar">
        <div className="nav-menu-inner">
          <button onClick={() => navigate('/')} className="nav-menu-link">TRANG CHỦ</button>
          
          <div className="nav-item-dropdown">
            <button onClick={() => { setSelectedCat(null); navigate('/shop'); }} className="nav-menu-link">SẢN PHẨM</button>
            <div className="dropdown-content">
              <button className="dropdown-item" onClick={() => { setSelectedCat(null); navigate('/shop'); }}>
                <span style={{ fontSize: '18px' }}>🐟</span> Tất cả sản phẩm
              </button>
              {productCategories.map(cat => (
                <button key={cat.id} className="dropdown-item" onClick={() => { setSelectedCat(cat.id); navigate('/shop'); }}>
                  <img src={resolveImageUrl(cat.imageUrl) || "https://images.unsplash.com/photo-1524704654690-b56c05c78a02?w=50&q=80"} alt={cat.name} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/blog')} className="nav-menu-link">TIN TỨC / BLOG</button>
          <button onClick={() => { navigate('/'); setTimeout(() => { const el = document.querySelector('.about-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="nav-menu-link">VỀ CHÚNG TÔI</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">{children}</main>

      {/* Slide-Out Cart Drawer */}
      {showCart && (
        <div className="cart-drawer-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h3>🛒 GIỎ HÀNG CỦA BẠN</h3>
              <button className="close-drawer-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>
            
            {cart.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🛒</div>
                <p>Giỏ hàng của bạn đang trống</p>
                <button className="shop-now-btn" onClick={() => setShowCart(false)}>Tiếp tục mua sắm</button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={resolveImageUrl(item.imageUrl) || 'https://picsum.photos/80/80'} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <div className="cart-item-price-qty">
                          <span className="cart-item-price">{item.price ? item.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}</span>
                          <div className="qty-controls">
                            <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="qty-btn">-</button>
                            <span className="qty-value">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="qty-btn">+</button>
                          </div>
                        </div>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-drawer-footer">
                  <div className="cart-total">
                    <span>Tổng tiền:</span>
                    <span className="cart-total-price">
                      {cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    💳 TIẾN HÀNH THANH TOÁN
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dark Footer */}
      <footer className="footer-dark-theme">
        <div className="footer-inner-grid">
          <div className="footer-col">
            <h3 className="footer-logo">DoanCMS<span>.Aqua</span></h3>
            <p className="footer-desc">
              Hệ thống cung cấp cá cảnh và thiết bị thủy sinh uy tín hàng đầu TPHCM. Mang thiên nhiên, tài lộc và sự thư thái vào không gian sống của bạn.
            </p>
          </div>
          <div className="footer-col">
            <h4>CHÍNH SÁCH</h4>
            <ul>
              <li><button onClick={() => alert('Đóng gói chuyên nghiệp, giao hàng nhanh chóng, cam kết cá khoẻ mạnh tận tay khách hàng.')}>Chính sách giao nhận cá</button></li>
              <li><button onClick={() => alert('Hoàn tiền hoặc đổi mới 1-1 nếu cá có dấu hiệu yếu/bệnh trong vòng 24h đầu.')}>Chính sách bảo hành cá 1-1</button></li>
              <li><button onClick={() => alert('Bảo mật tuyệt đối thông tin cá nhân và đơn hàng của quý khách.')}>Chính sách bảo mật thông tin</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>LIÊN HỆ</h4>
            <p>📍 Khu công nghệ cao, Võ Chí Công, Quận 9, TP. Hồ Chí Minh</p>
            <p>📞 Hotline: 090 123 4567</p>
            <p>✉️ Email: support@doancms.aqua</p>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <p>© 2026 DoanCMS Retail · Trần Văn Đoàn · MSSV: 2123110210 · CCQ2311F · Cao Đẳng Công Thương TPHCM</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('doan_cms_user') || 'null'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [theme, setTheme] = useState(() => localStorage.getItem('user_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('user_theme', theme);
  }, [theme]);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Reset form when modal opens
  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthMessage('');
    setAuthForm({ fullName: '', email: '', phone: '', address: '', password: '' });
    setShowAuthModal(true);
  };

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('doan_cms_cart') || '[]'));
  const [showCart, setShowCart] = useState(false);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const probe = async () => {
      for (const url of POTENTIAL_APIS) {
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 1200);
          const res = await fetch(`${url}/api/productapi`, { signal: controller.signal });
          clearTimeout(id);
          if (res.ok) {
            console.log("Found active backend API at:", url);
            localStorage.setItem('doan_cms_api_url', url);
            API = url;
            return url;
          }
        } catch (e) {
          // try next
        }
      }
      return API;
    };

    probe().then((resolvedApi) => {
      Promise.all([
        fetch(`${resolvedApi}/api/categoryapi`).then(r => r.json()).catch(() => []),
        fetch(`${resolvedApi}/api/postapi`).then(r => r.json()).catch(() => []),
        fetch(`${resolvedApi}/api/categoryproductapi`).then(r => r.json()).catch(() => []),
        fetch(`${resolvedApi}/api/productapi`).then(r => r.json()).catch(() => []),
        fetch(`${resolvedApi}/api/bannerapi`).then(r => r.json()).catch(() => [])
      ]).then(([cats, ps, prodCats, prods, bns]) => {
        setCategories(cats); setPosts(ps); setProductCategories(prodCats); setProducts(prods); setBanners(bns); setLoaded(true);
      }).catch(() => setLoaded(true));
    });
  }, []);

  useEffect(() => { localStorage.setItem('doan_cms_cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (product) => {
    if (!currentUser) {
      setAuthMode('login'); setAuthError('Vui lòng đăng nhập để bắt đầu mua sắm!'); openAuthModal('login'); return;
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
        if (authMode === 'register') {
          // After register success, switch to login with success message
          setAuthMessage('🎉 Đăng ký thành công! Vui lòng đăng nhập.');
          setAuthForm({ ...authForm, password: '' });
          setTimeout(() => { setAuthMode('login'); setAuthMessage(''); }, 1800);
        } else {
          // Login success
          setCurrentUser(data); 
          localStorage.setItem('doan_cms_user', JSON.stringify(data));
          setAuthMessage('✅ Đăng nhập thành công!');
          setTimeout(() => { setShowAuthModal(false); setAuthMessage(''); }, 1000);
        }
      } else { setAuthError(data.message || 'Thao tác thất bại!'); }
    } catch { setAuthError('Lỗi kết nối server!'); }
  };

  if (!loaded) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#1e3a8a', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-loading" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #10b981', borderRadius: '50%', margin: '0 auto 16px' }} />
          <style>{`
            .spinner-loading {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>Đang tải cửa hàng DoanCMS.Aqua...</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            min-height: 100vh;
          }

          .app-container {
            min-height: 100vh;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
          }

          /* Top Contacts Strip */
          .top-bar-strip {
            background-color: #0f172a;
            color: #94a3b8;
            font-size: 12px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }

          .top-bar-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .top-action-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
            font-weight: 600;
            transition: color 0.2s;
          }

          .top-action-btn:hover {
            color: white;
          }

          /* Main Header */
          .main-header-glass {
            background-color: white;
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }

          .header-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 18px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
          }

          .logo-brand-wrap {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
          }

          .logo-main {
            font-size: 26px;
            font-weight: 900;
            color: #1e3a8a;
            letter-spacing: -0.5px;
          }

          .logo-sub {
            font-size: 26px;
            font-weight: 900;
            color: #10b981;
          }

          /* Search Bar styling */
          .search-bar-wrapper {
            flex: 1;
            max-width: 500px;
            display: flex;
            position: relative;
          }

          .search-bar-wrapper input {
            width: 100%;
            padding: 11px 18px;
            padding-right: 48px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
            font-family: inherit;
          }

          .search-bar-wrapper input:focus {
            border-color: #1e3a8a;
            box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15);
          }

          .search-btn {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            background: #1e3a8a;
            border: none;
            color: white;
            padding: 0 16px;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
          }

          .search-btn:hover {
            background: #1e40af;
          }

          /* Header Cart button */
          .header-cart-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: inherit;
            color: #0f172a;
          }

          .cart-icon-wrapper {
            font-size: 24px;
            position: relative;
          }

          .cart-badge-count {
            position: absolute;
            top: -6px;
            right: -8px;
            background: #ef4444;
            color: white;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 100px;
            border: 2px solid white;
          }

          .cart-text-label {
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          /* Navigation Menu */
          .nav-menu-bar {
            background-color: white;
            border-bottom: 1px solid #f1f5f9;
            padding: 12px 0;
          }

          .nav-menu-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: center;
            gap: 32px;
          }

          .nav-menu-link {
            background: transparent;
            border: none;
            font-size: 13.5px;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
            letter-spacing: 1px;
            transition: all 0.2s;
            position: relative;
            padding: 4px 0;
            font-family: inherit;
          }

          .nav-menu-link:hover {
            color: #10b981;
          }

          .nav-menu-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #10b981;
            transition: width 0.2s;
          }

          .nav-menu-link:hover::after {
            width: 100%;
          }

          /* Practice Banner */
          .practice-banner {
            max-width: 1200px;
            margin: 32px auto;
            padding: 0 24px;
          }

          .practice-banner div {
            border: 2px dashed #cbd5e1;
            padding: 44px;
            background-color: white;
            color: #94a3b8;
            font-size: 15px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
            border-radius: 8px;
          }

          /* ===== BENEFITS ROW ===== */
          .benefits-row {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 32px 24px;
            border-radius: 16px;
          }

          .benefit-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            flex: 1;
          }

          .benefit-icon {
            font-size: 28px;
            width: 52px;
            height: 52px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: rgba(239, 68, 68, 0.08);
          }

          .benefit-text h4 {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px;
          }

          .benefit-text p {
            font-size: 12.5px;
            color: #64748b;
            margin: 0;
            line-height: 1.5;
          }

          /* ===== ABOUT SECTION ===== */
          .about-section {
            display: flex;
            align-items: center;
            gap: 48px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 24px;
          }

          .about-content {
            flex: 1;
          }

          .about-content h2 {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
          }

          .about-content p {
            font-size: 14px;
            line-height: 1.7;
            color: #475569;
            margin-bottom: 12px;
          }

          .btn-readmore-red {
            display: inline-block;
            margin-top: 12px;
            padding: 10px 24px;
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1px;
            cursor: pointer;
            font-family: inherit;
            transition: background 0.2s;
          }

          .btn-readmore-red:hover {
            background: #b91c1c;
          }

          .about-image {
            flex: 1;
            max-width: 480px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          }

          .about-image img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            display: block;
          }

          /* ===== RED SECTION HEADER ===== */
          .red-section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 14px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
          }

          .red-section-icon {
            font-size: 20px;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(220, 38, 38, 0.08);
            flex-shrink: 0;
          }

          .red-section-title {
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0;
          }

          @media (max-width: 768px) {
            .benefits-row {
              flex-direction: column;
              gap: 16px;
            }
            .about-section {
              flex-direction: column;
              gap: 24px;
              padding: 40px 24px;
            }
            .about-image {
              max-width: 100%;
            }
          }

          /* Category Tabs container */
          .category-tabs-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 35px;
            margin-top: 20px;
          }

          .cat-tab-pill {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px;
            background-color: white;
            border: 2px solid transparent;
            border-radius: 16px;
            width: 120px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: inherit;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          }

          .cat-tab-pill .cat-img-wrapper {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 8px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8fafc;
          }

          .cat-tab-pill .cat-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .cat-tab-pill .cat-name {
            font-size: 13px;
            font-weight: 700;
            color: #475569;
            text-align: center;
            transition: color 0.3s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
          }

          .cat-tab-pill:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          .cat-tab-pill:hover .cat-img-wrapper {
            border-color: #3b82f6;
          }

          .cat-tab-pill:hover .cat-img-wrapper img {
            transform: scale(1.1);
          }

          .cat-tab-pill.active {
            background-color: #3b82f6;
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.15);
          }

          .cat-tab-pill.active .cat-img-wrapper {
            border-color: white;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
          }

          .cat-tab-pill.active .cat-name {
            color: white;
          }

          /* Section titles */
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
          }

          .section-title {
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
            position: relative;
          }

          .section-title::after {
            content: '';
            position: absolute;
            bottom: -14px;
            left: 0;
            width: 80px;
            height: 2px;
            background: #10b981;
          }

          .section-title-center {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .section-subtitle {
            font-size: 13.5px;
            color: #64748b;
            margin-top: 6px;
          }

          .result-count-label {
            font-size: 13px;
            color: #64748b;
          }

          /* Products grid */
          .products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }

          .product-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            border-color: #cbd5e1;
          }

          .card-image-wrapper {
            position: relative;
            height: 250px;
            overflow: hidden;
            background: #f1f5f9;
          }

          .card-image-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
          }

          .product-card:hover .card-image-wrapper img {
            transform: scale(1.04);
          }

          .stock-badge-hot {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: #ef4444;
            color: white;
            font-size: 9.5px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
          }

          .sold-out-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(2px);
            color: white;
            font-weight: 800;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card-content {
            padding: 16px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .product-title {
            font-size: 14.5px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 8px;
            line-height: 1.4;
            min-height: 40px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .product-price-label {
            font-size: 17px;
            font-weight: 800;
            color: #ef4444;
            margin-bottom: 14px;
          }

          .card-actions-row {
            display: flex;
            gap: 8px;
            margin-top: auto;
          }

          .btn-action-info {
            flex: 1;
            padding: 8px;
            background-color: #0ea5e9;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 12.5px;
            cursor: pointer;
            transition: background 0.2s;
            font-family: inherit;
          }

          .btn-action-info:hover {
            background-color: #0284c7;
          }

          .btn-action-buy {
            flex: 1.2;
            padding: 8px;
            background-color: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 12.5px;
            cursor: pointer;
            transition: background 0.2s;
            font-family: inherit;
          }

          .btn-action-buy:hover:not(:disabled) {
            background-color: #059669;
          }

          .btn-action-buy:disabled {
            background-color: #cbd5e1;
            cursor: not-allowed;
          }

          /* Blog Card styling */
          .posts-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .post-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
          }

          .post-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.04);
            border-color: #cbd5e1;
          }

          .post-card-image {
            height: 180px;
            position: relative;
            background: #f1f5f9;
          }

          .post-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .post-card-category {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: #0f172a;
            color: white;
            font-size: 9.5px;
            font-weight: 800;
            padding: 3px 10px;
            border-radius: 4px;
          }

          .post-card-content {
            padding: 20px;
          }

          .post-date {
            font-size: 11.5px;
            color: #94a3b8;
            display: block;
            margin-bottom: 6px;
          }

          .post-card-content h3 {
            font-size: 15.5px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 8px;
            line-height: 1.4;
          }

          .post-card-content p {
            font-size: 12.5px;
            color: #64748b;
            line-height: 1.5;
            margin-bottom: 14px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .post-readmore {
            font-size: 12.5px;
            font-weight: 700;
            color: #10b981;
          }

          .post-readmore:hover {
            color: #059669;
          }

          /* ===== HERO BANNER ===== */
          .hero-banner-section {
            position: relative;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0c4a6e 100%);
            overflow: hidden;
            min-height: 380px;
            display: flex;
            align-items: center;
          }

          .hero-banner-overlay {
            position: absolute;
            inset: 0;
            background: url('https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=1400&auto=format&fit=crop&q=60') center/cover no-repeat;
            opacity: 0.12;
          }

          .hero-banner-inner {
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 24px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .hero-content {
            flex: 1;
            max-width: 600px;
          }

          .hero-badge {
            display: inline-block;
            background: rgba(16,185,129,0.2);
            border: 1px solid rgba(16,185,129,0.4);
            color: #6ee7b7;
            font-size: 12.5px;
            font-weight: 700;
            padding: 5px 14px;
            border-radius: 100px;
            margin-bottom: 18px;
            letter-spacing: 0.3px;
          }

          .hero-title {
            font-size: 42px;
            font-weight: 900;
            color: white;
            line-height: 1.2;
            margin-bottom: 16px;
            letter-spacing: -1px;
          }

          .hero-title span {
            color: #34d399;
          }

          .hero-desc {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 28px;
          }

          .hero-cta-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .hero-btn-primary {
            padding: 13px 28px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(16,185,129,0.35);
          }

          .hero-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16,185,129,0.45);
          }

          .hero-btn-secondary {
            padding: 13px 28px;
            background: rgba(255,255,255,0.08);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s;
            backdrop-filter: blur(4px);
          }

          .hero-btn-secondary:hover {
            background: rgba(255,255,255,0.15);
          }

          .hero-fish-deco {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            user-select: none;
          }

          .fish-float {
            font-size: 52px;
            animation: fishSwim 3s ease-in-out infinite;
            display: block;
          }

          .fish-float.f2 { animation-delay: 0.6s; font-size: 44px; }
          .fish-float.f3 { animation-delay: 1.2s; font-size: 36px; }

          @keyframes fishSwim {
            0%, 100% { transform: translateY(0) scaleX(1); }
            25% { transform: translateY(-10px) scaleX(1.05); }
            75% { transform: translateY(6px) scaleX(0.95); }
          }

          /* ===== HOME PRODUCT SECTIONS ===== */
          .home-product-section {
            margin-top: 56px;
          }

          .home-section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e2e8f0;
          }

          .home-section-label {
            font-size: 12.5px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }

          .home-section-title {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
            margin-bottom: 6px;
          }

          .home-section-underline {
            width: 52px;
            height: 3px;
            border-radius: 2px;
          }

          .view-all-btn {
            background: transparent;
            border: 1.5px solid;
            padding: 7px 18px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .view-all-btn:hover {
            opacity: 0.8;
            transform: translateX(2px);
          }

          .home-products-grid-3 {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          /* ===== SHOP PAGE ===== */
          .shop-hero {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            padding: 40px 0;
            text-align: center;
          }

          .shop-hero-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          .shop-hero-title {
            font-size: 32px;
            font-weight: 900;
            color: white;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }

          .shop-hero-sub {
            font-size: 14.5px;
            color: #93c5fd;
          }

          .shop-result-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 24px;
            font-size: 13.5px;
            color: #64748b;
          }

          .shop-clear-filter {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #ef4444;
            padding: 5px 14px;
            border-radius: 6px;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            font-family: inherit;
          }

          .shop-clear-filter:hover {
            background: #fee2e2;
          }

          /* Slide-out Cart Drawer */
          .cart-drawer-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(2px);
            z-index: 500;
            display: flex;
            justify-content: flex-end;
          }

          .cart-drawer {
            width: 100%;
            max-width: 420px;
            background: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            box-shadow: -5px 0 25px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          @keyframes modalSlideIn {
            from { 
              opacity: 0; 
              transform: translateY(20px) scale(0.97); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }

          .cart-drawer-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .cart-drawer-header h3 {
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 0.5px;
          }

          .close-drawer-btn {
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #64748b;
          }

          .cart-empty {
            padding: 80px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
          }

          .cart-empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.3;
          }

          .cart-empty p {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 24px;
          }

          .shop-now-btn {
            padding: 12px 24px;
            background-color: #0f172a;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13.5px;
            cursor: pointer;
            font-family: inherit;
          }

          .cart-items-list {
            flex: 1;
            overflow-y: auto;
            padding: 12px 24px;
          }

          .cart-item {
            display: flex;
            gap: 14px;
            padding: 16px 0;
            border-bottom: 1px solid #f1f5f9;
            position: relative;
          }

          .cart-item-img {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }

          .cart-item-info {
            flex: 1;
          }

          .cart-item-info h4 {
            font-size: 13.5px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            line-height: 1.4;
          }

          .cart-item-price-qty {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .cart-item-price {
            font-size: 13.5px;
            font-weight: 800;
            color: #ef4444;
          }

          .qty-controls {
            display: flex;
            align-items: center;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
            background-color: #f8fafc;
          }

          .qty-btn {
            background: transparent;
            border: none;
            width: 28px;
            height: 28px;
            font-size: 14px;
            cursor: pointer;
            font-weight: bold;
            color: #475569;
          }

          .qty-btn:hover {
            background-color: #e2e8f0;
          }

          .qty-value {
            font-size: 13px;
            font-weight: 700;
            padding: 0 10px;
            color: #0f172a;
          }

          .remove-item-btn {
            position: absolute;
            top: 12px;
            right: 0;
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 13px;
          }

          .remove-item-btn:hover {
            color: #ef4444;
          }

          .cart-drawer-footer {
            padding: 24px;
            border-top: 1px solid #e2e8f0;
            background-color: #f8fafc;
          }

          .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
          }

          .cart-total-price {
            font-size: 20px;
            font-weight: 900;
            color: #ef4444;
          }

          .checkout-btn {
            width: 100%;
            padding: 14px;
            background-color: #10b981;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            letter-spacing: 0.5px;
            font-family: inherit;
            transition: background 0.2s;
          }

          .checkout-btn:hover {
            background-color: #059669;
          }

          /* Footer */
          .footer-dark-theme {
            background-color: #0f172a;
            color: #94a3b8;
            padding-top: 60px;
            margin-top: auto;
            border-top: 1px solid rgba(255,255,255,0.05);
          }

          .footer-inner-grid {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px 44px;
            display: grid;
            grid-template-columns: 2fr 1fr 1.5fr;
            gap: 40px;
          }

          .footer-col h3.footer-logo {
            font-size: 24px;
            font-weight: 900;
            color: white;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
          }

          .footer-col h3.footer-logo span {
            color: #10b981;
          }

          .footer-desc {
            font-size: 13.5px;
            line-height: 1.6;
            color: #94a3b8;
          }

          .footer-col h4 {
            font-size: 14px;
            font-weight: 800;
            color: white;
            margin-bottom: 20px;
            letter-spacing: 1px;
          }

          .footer-col ul {
            list-style: none;
          }

          .footer-col ul li {
            margin-bottom: 12px;
          }

          .footer-col ul li button {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 13.5px;
            cursor: pointer;
            text-align: left;
            padding: 0;
            font-family: inherit;
            transition: color 0.2s;
          }

          .footer-col ul li button:hover {
            color: white;
          }

          .footer-col p {
            font-size: 13.5px;
            margin-bottom: 14px;
            line-height: 1.5;
          }

          .footer-bottom-bar {
            background-color: rgba(0,0,0,0.15);
            padding: 20px 0;
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.03);
          }

          .footer-bottom-bar p {
            font-size: 11.5px;
            color: #64748b;
          }

          .main-content {
            flex: 1;
          }

          /* Responsive fixes */
          @media (max-width: 1024px) {
            .products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 768px) {
            .header-inner {
              flex-direction: column;
              gap: 16px;
            }
            .search-bar-wrapper {
              width: 100%;
            }
            .products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .posts-grid {
              grid-template-columns: 1fr;
            }
            .footer-inner-grid {
              grid-template-columns: 1fr;
              gap: 32px;
            }
          }

          /* Toast notification styling */
          .toast-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 16px 24px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5);
            border-left: 5px solid #cbd5e1;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
            font-weight: 700;
            font-size: 14.5px;
            pointer-events: auto;
          }
          .toast-notification.success {
            border-left-color: #10b981;
            color: #064e3b;
          }
          .toast-notification.error {
            border-left-color: #ef4444;
            color: #7f1d1d;
          }
          .toast-notification.info {
            border-left-color: #3b82f6;
            color: #1e3a8a;
          }
          @keyframes toastSlideIn {
            from { transform: translateX(120%) scale(0.9); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
        `}</style>

        <GlobalLayout 
          cart={cart}
          setCart={setCart}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          showCart={showCart}
          setShowCart={setShowCart} 
          currentUser={currentUser} 
          setShowAuthModal={setShowAuthModal} 
          setAuthMode={setAuthMode}
          setCurrentUser={setCurrentUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          productCategories={productCategories}
          setSelectedCat={setSelectedCat}
          showToast={showToast}
          theme={theme}
          setTheme={setTheme}
        >
          <Routes>
            <Route path="/" element={<Home banners={banners} categories={categories} posts={posts} productCategories={productCategories} products={products} addToCart={addToCart} addedId={addedId} searchTerm={searchTerm} setSelectedCat={setSelectedCat} />} />
            <Route path="/shop" element={<Shop productCategories={productCategories} products={products} addToCart={addToCart} addedId={addedId} searchTerm={searchTerm} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />} />
            <Route path="/blog" element={<Blog categories={categories} posts={posts} searchTerm={searchTerm} />} />
            <Route path="/post/:id" element={<PostDetail api={API} />} />
            <Route path="/product/:id" element={<ProductDetail api={API} addToCart={addToCart} cart={cart} products={products} productCategories={productCategories} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} api={API} showToast={showToast} />} />
          </Routes>
        </GlobalLayout>

        {/* Auth Modal - Liquid Glass Style */}
        {showAuthModal && (
          <div
            onClick={() => setShowAuthModal(false)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(15, 23, 42, 0.5)', 
              backdropFilter: 'blur(8px)', 
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 999, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ 
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                padding: '40px 36px', 
                borderRadius: '24px', 
                width: '100%', 
                maxWidth: '440px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.5)',
                animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Modal Header */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                  {authMode === 'login' ? '🔑' : '🎉'}
                </div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
                  {authMode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
                  {authMode === 'login' ? 'Đăng nhập để tiếp tục mua sắm' : 'Tham gia cộng đồng Thủy Sinh Xanh'}
                </p>
              </div>
              
              {authError && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textAlign: 'center', background: 'rgba(239,68,68,0.06)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.15)' }}>{authError}</div>}
              {authMessage && <div style={{ color: '#10b981', marginBottom: '16px', fontSize: '13px', fontWeight: '600', textAlign: 'center', background: 'rgba(16,185,129,0.06)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.15)' }}>{authMessage}</div>}
              
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {authMode === 'register' && (
                  <>
                    <input 
                      type="text" 
                      placeholder="Họ và tên *" 
                      required 
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} 
                      value={authForm.fullName} 
                      onChange={e => setAuthForm({...authForm, fullName: e.target.value})} 
                    />
                    <input 
                      type="tel" 
                      placeholder="Số điện thoại *" 
                      required 
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} 
                      value={authForm.phone} 
                      onChange={e => setAuthForm({...authForm, phone: e.target.value})} 
                    />
                    <input 
                      type="text" 
                      placeholder="Địa chỉ (tùy chọn)" 
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} 
                      value={authForm.address} 
                      onChange={e => setAuthForm({...authForm, address: e.target.value})} 
                    />
                  </>
                )}
                <input 
                  type="email" 
                  placeholder="Email *" 
                  required 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} 
                  value={authForm.email} 
                  onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                />
                <input 
                  type="password" 
                  placeholder="Mật khẩu *" 
                  required 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} 
                  value={authForm.password} 
                  onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                />
                <button type="submit" style={{ 
                  padding: '13px', 
                  background: authMode === 'register' ? 'linear-gradient(135deg, #10b981, #059669)' : '#1e3a8a', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: '800',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s'
                }}>
                  {authMode === 'login' ? '🔑 ĐĂNG NHẬP' : '✨ TẠO TÀI KHOẢN'}
                </button>
              </form>
              
              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px' }}>
                <span
                  onClick={() => {
                    const nextMode = authMode === 'login' ? 'register' : 'login';
                    setAuthMode(nextMode);
                    setAuthError('');
                    setAuthMessage('');
                  }}
                  style={{ color: '#1e3a8a', cursor: 'pointer', fontWeight: '700' }}
                >
                  {authMode === 'login' ? '✍️ Chưa có tài khoản? Đăng ký ngay' : '🔑 Đã có tài khoản? Đăng nhập'}
                </span>
              </div>
              
              <button onClick={() => setShowAuthModal(false)} style={{ 
                width: '100%', 
                marginTop: '16px', 
                background: '#f1f5f9', 
                border: 'none', 
                padding: '10px',
                borderRadius: '8px',
                color: '#64748b', 
                cursor: 'pointer',
                fontWeight: '700',
                fontFamily: 'inherit'
              }}>
                Đóng
              </button>
            </div>
          </div>
        )}
        {toast.show && (
          <div className={`toast-notification ${toast.type}`}>
            <span>
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}