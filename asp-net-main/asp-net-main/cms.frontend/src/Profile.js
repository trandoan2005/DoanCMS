import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ currentUser, setCurrentUser, api, showToast }) {
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    setProfileForm({
      fullName: currentUser.fullName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      password: '' // empty for safety, only set if changing
    });

    // Fetch order history
    fetch(`${api}/api/orderapi/customer/${currentUser.id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoadingOrders(false);
      })
      .catch(() => {
        setLoadingOrders(false);
      });
  }, [currentUser, api, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 2MB to prevent localStorage overflow)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Kích thước ảnh quá lớn (vui lòng chọn ảnh dưới 2MB)!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedUser = { ...currentUser, avatar: base64String };
      setCurrentUser(updatedUser);
      localStorage.setItem('doan_cms_user', JSON.stringify(updatedUser));
      showToast('Thay ảnh đại diện thành công!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      const res = await fetch(`${api}/api/customerapi/update/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Cập nhật hồ sơ thành công!', 'success');
        const updatedUser = { ...data, avatar: currentUser.avatar };
        setCurrentUser(updatedUser);
        localStorage.setItem('doan_cms_user', JSON.stringify(updatedUser));
      } else {
        showToast(data.message || 'Cập nhật thất bại!', 'error');
      }
    } catch {
      showToast('Lỗi kết nối đến máy chủ!', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="page-transition" style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column - Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          padding: '30px 24px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 16px' }}>
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt="Avatar" 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 15px rgba(0,0,0,0.12)' }} 
                />
              ) : (
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                  color: 'white',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
                }}>
                  {currentUser.fullName ? currentUser.fullName.substring(0, 1).toUpperCase() : 'U'}
                </div>
              )}
              <label 
                htmlFor="avatar-input" 
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#10b981',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  border: '2px solid white',
                  fontSize: '12px'
                }}
                title="Thay ảnh đại diện"
              >
                📷
              </label>
              <input 
                type="file" 
                id="avatar-input" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: 'none' }} 
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>{currentUser.fullName}</h3>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(59,130,246,0.1)',
              color: '#2563eb',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Thành viên Aqua</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca' }}>{error}</div>}
            {message && <div style={{ color: '#10b981', fontSize: '13px', fontWeight: '600', background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>{message}</div>}

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                value={profileForm.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                name="email"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                value={profileForm.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                value={profileForm.phone}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Địa chỉ nhận hàng</label>
              <input
                type="text"
                name="address"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                value={profileForm.address}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Mật khẩu mới (bỏ trống nếu không đổi)</label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu mới"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                value={profileForm.password}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" disabled={saving} style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '13.5px',
              marginTop: '10px',
              transition: 'opacity 0.2s'
            }}>
              {saving ? 'ĐANG LƯU...' : '💾 CẬP NHẬT HỒ SƠ'}
            </button>
          </form>
        </div>

        {/* Right Column - Order History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          padding: '30px 24px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
          minHeight: '400px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #cbd5e1', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📦 Lịch sử mua hàng</span>
            <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '100px' }}>{orders.length} đơn</span>
          </h3>

          {loadingOrders ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <style>{`@keyframes spinProfile { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <div style={{ width: '30px', height: '30px', border: '3px solid #cbd5e1', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spinProfile 1s linear infinite' }} />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <p style={{ fontWeight: '600' }}>Bạn chưa thực hiện đơn hàng nào.</p>
              <button onClick={() => navigate('/shop')} style={{ marginTop: '16px', padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map(order => (
                <div key={order.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                    <div>
                      <span style={{ fontWeight: '800', color: '#0f172a' }}>Đơn hàng #{order.id}</span>
                      <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '12px' }}>📅 {new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: order.status === 0 ? '#fef3c7' : order.status === 1 ? '#dbeafe' : order.status === 2 ? '#dcfce7' : '#fee2e2',
                        color: order.status === 0 ? '#d97706' : order.status === 1 ? '#1d4ed8' : order.status === 2 ? '#15803d' : '#b91c1c'
                      }}>
                        {order.status === 0 ? 'Chờ xử lý' : order.status === 1 ? 'Đang giao' : order.status === 2 ? 'Đã giao' : 'Đã hủy'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569' }}>
                        <span>• {item.productName} <strong style={{ color: '#0f172a' }}>x{item.quantity}</strong></span>
                        <span>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')} ₫</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '10px', fontSize: '14.5px' }}>
                    <span style={{ color: '#64748b', fontSize: '12.5px' }}>
                      {order.notes ? `📝 Ghi chú: ${order.notes}` : ''}
                    </span>
                    <div>
                      <span style={{ fontWeight: '700', color: '#475569', marginRight: '6px', fontSize: '13px' }}>Tổng thanh toán:</span>
                      <strong style={{ color: '#ef4444', fontSize: '17px', fontWeight: '800' }}>
                        {order.totalAmount.toLocaleString('vi-VN')} ₫
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
