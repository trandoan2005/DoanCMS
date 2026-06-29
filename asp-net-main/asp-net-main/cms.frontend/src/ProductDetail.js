import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = 'https://localhost:7226';

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const activeApi = localStorage.getItem('doan_cms_api_url') || API;
  return `${activeApi}${url.startsWith('/') ? '' : '/'}${url}`;
};

function ProductDetail({ addToCart, cart, products, productCategories }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'specs' | 'shipping'

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotX = -(y / box.height) * 12;
    const rotY = (x / box.width) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
    
    const shine = card.querySelector('.shine-overlay');
    if (shine) {
      const px = (e.clientX - box.left) / box.width * 100;
      const py = (e.clientY - box.top) / box.height * 100;
      shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
    }
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    const shine = card.querySelector('.shine-overlay');
    if (shine) {
      shine.style.background = 'transparent';
    }
  };

  useEffect(() => {
    setLoading(true);
    // Cuộn lên đầu trang khi thay đổi ID sản phẩm
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Thử tìm trong danh sách products được truyền xuống trước để hiển thị tức thì
    if (products && products.length > 0) {
      const found = products.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setLoading(false);
      }
    }

    const activeApi = localStorage.getItem('doan_cms_api_url') || API;
    fetch(`${activeApi}/api/productapi/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi fetch chi tiết sản phẩm:', err);
        setLoading(false);
      });
  }, [id, products]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
        <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #00c8ff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginRight: '15px' }} />
        Đang tải thông tin sản phẩm...
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Không tìm thấy sản phẩm!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '30px' }}>Sản phẩm này không tồn tại hoặc đã bị xóa khỏi cửa hàng.</p>
        <button onClick={() => navigate('/')} style={{ padding: '12px 30px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return;
    // Thêm số lượng đã chọn
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Tìm các sản phẩm liên quan (cùng danh mục, bỏ sản phẩm hiện tại)
  const relatedProducts = products
    ? products.filter(p => p.categoryProductId === product.categoryProductId && p.id !== product.id).slice(0, 4)
    : [];

  return (
    <div className="page-transition" style={{ padding: '40px 24px 80px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      {/* Breadcrumbs & Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/')} className="hover-link">Cửa hàng</span>
          <span>/</span>
          <span style={{ color: '#00c8ff', fontWeight: '500' }}>{product.categoryProduct?.name || 'Sản phẩm'}</span>
          <span>/</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{product.name}</span>
        </div>
        <button onClick={() => navigate('/')} className="back-btn" style={{
          padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          ← Quay lại danh sách
        </button>
      </div>

      <style>{`
        .back-btn:hover { background: rgba(255,255,255,0.15) !important; border-color: rgba(255,255,255,0.25) !important; transform: translateX(-4px); }
        .hover-link:hover { color: white !important; }
        .tab-btn { transition: all 0.3s ease; border-bottom: 2px solid transparent !important; }
        .tab-btn.active { color: #00c8ff !important; border-bottom: 2px solid #00c8ff !important; }
        .related-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.1s ease, border-color 0.4s, box-shadow 0.4s;
        }
        .related-card:hover {
          border-color: rgba(0,200,255,0.35) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
        }
        .related-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.15) 30%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.15) 70%,
            transparent
          );
          transform: skewX(-25deg);
          transition: none;
          pointer-events: none;
          z-index: 6;
        }
        .related-card:hover::after {
          left: 150%;
          transition: left 0.8s ease-in-out;
        }
        .add-cart-btn {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .add-cart-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.45);
        }
        .add-cart-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25) 30%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.25) 70%,
            transparent
          );
          transform: skewX(-25deg);
          transition: none;
          pointer-events: none;
        }
        .add-cart-btn:hover::after {
          left: 150%;
          transition: left 0.8s ease-in-out;
        }
        .img-container:hover img { transform: scale(1.06); }
        .img-container img { transition: transform 0.6s cubic-bezier(0.15, 1, 0.3, 1); }
        @keyframes iosSlideIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .page-transition {
          animation: iosSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* Main product display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '48px', alignItems: 'start' }}>
        
        {/* Left Column: Premium Image Gallery */}
        <div className="img-container" style={{
          position: 'relative', borderRadius: '28px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 70px rgba(0,0,0,0.4)', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={resolveImageUrl(product.imageUrl) || `https://picsum.photos/600/600?random=${product.id}`} 
               alt={product.name} 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
               onError={e => e.target.src = `https://picsum.photos/600/600?random=${product.id}`} />
          
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)', pointerEvents: 'none' }} />
          
          {/* Badge Category */}
          <span style={{
            position: 'absolute', top: '20px', left: '20px',
            background: 'rgba(0, 200, 255, 0.85)', backdropFilter: 'blur(10px)',
            color: 'white', padding: '6px 16px', borderRadius: '100px',
            fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', boxShadow: '0 4px 15px rgba(0,200,255,0.3)'
          }}>
            {product.categoryProduct?.name || 'Sản phẩm'}
          </span>

          {/* Stock status badge */}
          <span style={{
            position: 'absolute', top: '20px', right: '20px',
            background: product.stockQuantity > 0 ? 'rgba(74, 222, 128, 0.85)' : 'rgba(239, 68, 68, 0.85)',
            backdropFilter: 'blur(10px)', color: 'white', padding: '6px 16px', borderRadius: '100px',
            fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px'
          }}>
            {product.stockQuantity > 0 ? `Còn hàng` : 'Hết hàng'}
          </span>
        </div>

        {/* Right Column: Premium Purchase Panel */}
        <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
          {/* Rating & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ color: '#ffb300', fontSize: '15px' }}>⭐⭐⭐⭐⭐</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>(4.8 / 5 điểm từ khách hàng)</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 16px', lineHeight: '1.25', background: 'linear-gradient(135deg, #fff 50%, rgba(0,200,255,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{product.name}</h1>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '36px', fontWeight: '900', color: '#ff6b8b', textShadow: '0 0 20px rgba(255,107,139,0.2)' }}>
              {product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}
            </span>
          </div>

          {/* Stock Indicator Progress Bar */}
          <div style={{ marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Trạng thái tồn kho:</span>
              <strong style={{ color: product.stockQuantity > 0 ? '#4ade80' : '#f87171' }}>
                {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm trong kho` : 'Hết hàng'}
              </strong>
            </div>
            {product.stockQuantity > 0 && (
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (product.stockQuantity / 20) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4ade80, #00c8ff)',
                  borderRadius: '10px'
                }} />
              </div>
            )}
          </div>

          {/* Tabs for Description & Specs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('desc')} className={`tab-btn${activeTab === 'desc' ? ' active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'desc' ? 'white' : 'rgba(255,255,255,0.4)', padding: '10px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Mô tả chi tiết</button>
            <button onClick={() => setActiveTab('specs')} className={`tab-btn${activeTab === 'specs' ? ' active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'specs' ? 'white' : 'rgba(255,255,255,0.4)', padding: '10px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Thông số</button>
            <button onClick={() => setActiveTab('shipping')} className={`tab-btn${activeTab === 'shipping' ? ' active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'shipping' ? 'white' : 'rgba(255,255,255,0.4)', padding: '10px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Giao nhận</button>
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '100px', fontSize: '14.5px', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            {activeTab === 'desc' && (
              <p style={{ margin: 0 }}>{product.description || 'Không có mô tả sản phẩm chi tiết cho mặt hàng này. Đây là giống cá cảnh đẹp được tuyển chọn kỹ lưỡng từ các trại nuôi uy tín, đảm bảo sức khỏe tốt và màu sắc rực rỡ.'}</p>
            )}
            {activeTab === 'specs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Danh mục</span>
                  <span>{product.categoryProduct?.name || 'Cá cảnh'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Nguồn gốc</span>
                  <span>Nhập khẩu / Thuần chủng</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Cửa hàng</span>
                  <span>DoanCMS Aquarium</span>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <p style={{ margin: 0, color: '#a29bfe' }}>⚡ Giao cá cảnh sống an toàn và bảo hành vận chuyển trong nội thành TP.HCM chỉ từ 2-4 tiếng. Cam kết hoàn tiền 100% nếu cá có vấn đề khi giao nhận. Miễn phí vận chuyển đơn hàng từ 500,000₫ trở lên!</p>
            )}
          </div>

          {/* Quantity selector & Add to cart button */}
          {product.stockQuantity > 0 ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Qty Selector */}
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '6px' }}>
                <button
                  onClick={() => setQuantity(p => Math.max(1, p - 1))}
                  style={{ width: '32px', height: '32px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: '700', fontSize: '16px' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(p => Math.min(product.stockQuantity, p + 1))}
                  style={{ width: '32px', height: '32px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>

              {/* Add to cart Button */}
              <button
                onClick={handleAddToCart}
                className="add-cart-btn"
                style={{
                  flex: 1, padding: '16px', borderRadius: '16px', border: 'none',
                  background: added ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '700',
                  boxShadow: added ? '0 10px 25px rgba(16,185,129,0.3)' : '0 10px 25px rgba(99,102,241,0.3)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {added ? '✅ Đã thêm vào giỏ!' : `🛒 Thêm ${quantity} vào giỏ hàng`}
              </button>
            </div>
          ) : (
            <button
              disabled
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)',
                cursor: 'not-allowed', fontSize: '16px', fontWeight: '700'
              }}
            >
              Hết hàng tạm thời
            </button>
          )}

          {/* Secure badging */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { icon: '🚚', text: 'Giao hàng hỏa tốc' },
              { icon: '🛡️', text: 'Chính hãng 100%' },
              { icon: '🔄', text: 'Đổi trả miễn phí' }
            ].map((b, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '6px' }}>{b.icon}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{b.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>🐠 Cá cảnh khác tại cửa hàng</h2>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(0,200,255,0.4), transparent)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {relatedProducts.map((p, idx) => (
              <div key={p.id} className="related-card" onClick={() => navigate(`/product/${p.id}`)} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave} style={{
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
                overflow: 'hidden', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <div className="shine-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'background 0.1s ease', zIndex: 5 }} />
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative', zIndex: 6 }}>
                  <img src={resolveImageUrl(p.imageUrl) || `https://picsum.photos/400/300?random=${p.id}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = `https://picsum.photos/400/300?random=${p.id}`} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', padding: '2px 10px', borderRadius: '100px', fontSize: '10px', color: '#00c8ff', border: '1px solid rgba(0,200,255,0.3)', backdropFilter: 'blur(5px)' }}>
                    {p.categoryProduct?.name || 'Sản phẩm'}
                  </div>
                </div>
                <div style={{ padding: '16px', position: 'relative', zIndex: 6 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '14.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#ff6b8b' }}>{p.price ? p.price.toLocaleString('vi-VN') + ' ₫' : 'Liên hệ'}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Còn: {p.stockQuantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
