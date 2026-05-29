import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PostDetail from './PostDetail';
import './App.css';

function Home() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://localhost:7226/api/categoryapi')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Lỗi Category:', err));

    fetch('https://localhost:7226/api/postapi')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => console.error('Lỗi Post:', err));
  }, []);

  return (
    <div className="App" style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        <h1 style={{ color: '#007bff' }}>HỆ THỐNG QUẢN LÝ CMS - BUỔI 2</h1>
        <p>Sinh viên thực hiện: <b>Trần Văn Đoàn</b></p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h2>Danh mục (Categories)</h2>
        {loading ? <p>Đang tải...</p> : null}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tên Danh Mục</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Mô Tả</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', textAlign: 'center' }}>{item.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '12px', color: '#555' }}>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ marginTop: '30px' }}>Bài viết (Posts)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#28a745', color: '#fff' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tiêu Đề</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Danh Mục</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Ngày Tạo</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                onClick={() => navigate(`/post/${item.id}`)}>
                <td style={{ padding: '12px', textAlign: 'center' }}>{item.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{item.title}</td>
                <td style={{ padding: '12px', color: '#555' }}>{item.category?.name}</td>
                <td style={{ padding: '12px', color: '#555' }}>{new Date(item.createdDate).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
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