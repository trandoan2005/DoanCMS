import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://localhost:7226/api/postapi/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => console.error('Lỗi:', err));
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Đang tải...</p>;
  if (!post) return <p style={{ padding: '20px' }}>Không tìm thấy bài viết!</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        ← Quay lại
      </button>
      <h1 style={{ color: '#007bff' }}>{post.title}</h1>
      <p style={{ color: '#888' }}>Danh mục: <b>{post.category?.name}</b> | Ngày: {new Date(post.createdDate).toLocaleDateString('vi-VN')}</p>
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} />}
      <p style={{ lineHeight: '1.8', fontSize: '16px' }}>{post.content}</p>
    </div>
  );
}

export default PostDetail;