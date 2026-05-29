import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PostDetail from './PostDetail';

const API = 'https://localhost:7226';

function Home() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/categoryapi`).then(r => r.json()),
      fetch(`${API}/api/postapi`).then(r => r.json())
    ]).then(([cats, ps]) => {
      setCategories(cats);
      setPosts(ps);
      setLoaded(true);
    }).catch(console.error);
  }, []);

  const filtered = selectedCategory ? posts.filter(p => p.categoryId === selectedCategory) : posts;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      color: 'white'
    }}>
      {/* Animated blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,80,255,0.3), transparent 70%)', top: '-200px', left: '-100px', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.2), transparent 70%)', bottom: '-100px', right: '-100px', animation: 'float2 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,150,0.15), transparent 70%)', top: '40%', left: '40%', animation: 'float3 12s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,60px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,-40px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-50px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .card-hover:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.4) !important; }
        .card-hover { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .cat-btn:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-2px); }
        .cat-btn { transition: all 0.3s ease; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          ✦ DoanCMS
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>
          TRẦN VĂN ĐOÀN · 2123110210
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '80px 20px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '13px', letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase' }}>
          Hệ thống quản lý nội dung
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: '800', margin: '0 0 16px', letterSpacing: '-2px', background: 'linear-gradient(135deg, #fff 30%, rgba(180,140,255,0.9))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          DoanCMS
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
          Website thời trang & tin tức · Cao Đẳng Công Thương TPHCM
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
          {[
            { label: 'Danh mục', value: categories.length },
            { label: 'Bài viết', value: posts.length },
            { label: 'API Endpoints', value: 4 }
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '20px 32px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* CATEGORY FILTER */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>Lọc theo danh mục</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[{ id: null, name: 'Tất cả' }, ...categories].map(cat => (
              <button key={cat.id} className="cat-btn"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 22px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)',
                  background: selectedCategory === cat.id ? 'rgba(140,100,255,0.5)' : 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: selectedCategory === cat.id ? '600' : '400'
                }}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* POSTS GRID */}
        <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', textTransform: 'uppercase' }}>
          {filtered.length} bài viết
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filtered.map((post, i) => (
            <div key={post.id} className="card-hover"
              onClick={() => navigate(`/post/${post.id}`)}
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
                animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img src={post.imageUrl || `https://picsum.photos/400/20${i}`} alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                <span style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  background: 'rgba(140,100,255,0.8)', backdropFilter: 'blur(10px)',
                  padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px'
                }}>{post.category?.name}</span>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', lineHeight: '1.4', color: 'rgba(255,255,255,0.92)' }}>{post.title}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
                  📅 {new Date(post.createdDate).toLocaleDateString('vi-VN')} · Nhấn để xem chi tiết →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: 'center', padding: '30px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.3)', fontSize: '13px',
        position: 'relative', zIndex: 1
      }}>
        © 2026 DoanCMS · Trần Văn Đoàn · MSSV: 2123110210 · CCQ2311F
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;