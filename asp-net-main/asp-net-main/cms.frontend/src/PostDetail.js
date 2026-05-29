import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = 'https://localhost:7226';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch(`${API}/api/postapi/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy bài viết');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi fetch bài viết:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
        <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #8b5cf6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginRight: '15px' }} />
        Đang tải nội dung bài viết...
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'white' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📰</div>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Không tìm thấy bài viết!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '30px' }}>Bài viết này không tồn tại hoặc đã được gỡ bỏ.</p>
        <button onClick={() => navigate('/')} style={{ padding: '12px 30px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => navigate('/')} className="hover-link">Trang chủ</span>
          <span>/</span>
          <span style={{ color: '#8b5cf6', fontWeight: '500' }}>Tin tức & Sự kiện</span>
        </div>
        <button onClick={() => navigate('/')} className="back-btn" style={{
          padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          ← Quay lại trang chủ
        </button>
      </div>

      <style>{`
        .back-btn:hover { background: rgba(255,255,255,0.15) !important; border-color: rgba(255,255,255,0.25) !important; transform: translateX(-4px); }
        .hover-link:hover { color: white !important; }
        .article-content p { margin-bottom: 20px; text-align: justify; }
      `}</style>

      {/* Article Panel */}
      <article style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        {/* Category & Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#c084fc', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>
            📁 {post.category?.name}
          </span>
          <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.4)' }}>
            📅 Đăng ngày: {new Date(post.createdDate).toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 24px', lineHeight: '1.3', background: 'linear-gradient(135deg, #fff 50%, rgba(139,92,246,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {post.title}
        </h1>

        {/* Banner Image */}
        {post.imageUrl && (
          <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', marginBottom: '32px' }}>
            <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Content Body */}
        <div className="article-content" style={{ fontSize: '16.5px', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.2px' }}>
          {post.content ? (
            post.content.split('\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)
          ) : (
            <p>Không có nội dung bài viết.</p>
          )}
        </div>

        {/* Author sign off */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
          <span>DoanCMS Editorial Team</span>
          <span>✦ Chúc bạn một ngày tốt lành!</span>
        </div>
      </article>
    </div>
  );
}

export default PostDetail;