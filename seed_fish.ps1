$server = 'localhost\SQLEXPRESS01'
$db = 'DoanCMS_DB'

function Exec($sql) {
    Invoke-Sqlcmd -ServerInstance $server -Database $db -TrustServerCertificate -Query $sql -Verbose
}

Write-Host "Inserting CategoryProducts..." -ForegroundColor Cyan

Exec "INSERT INTO CategoryProducts (Name, Description) VALUES (N'Cá Nước Ngọt', N'Các loài cá cảnh nước ngọt phổ biến, dễ nuôi, phù hợp cho người mới bắt đầu')"
Exec "INSERT INTO CategoryProducts (Name, Description) VALUES (N'Cá Biển', N'Các loài cá cảnh biển màu sắc rực rỡ, thích hợp cho hồ muối')"
Exec "INSERT INTO CategoryProducts (Name, Description) VALUES (N'Cá Vàng & Koi', N'Cá vàng và cá Koi Nhật Bản cao cấp, phong thủy may mắn')"
Exec "INSERT INTO CategoryProducts (Name, Description) VALUES (N'Phụ Kiện Hồ Cá', N'Máy lọc, đèn LED, sỏi, cây thủy sinh và các phụ kiện trang trí hồ cá')"
Exec "INSERT INTO CategoryProducts (Name, Description) VALUES (N'Thức Ăn & Dinh Dưỡng', N'Thức ăn chuyên dụng, vitamin và khoáng chất cho cá cảnh')"

Write-Host "Inserting Products..." -ForegroundColor Cyan

# Cá Nước Ngọt (CatId = 1)
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Betta Halfmoon Thái Lan', N'Cá Betta Halfmoon thuần chủng nhập khẩu từ Thái Lan. Đuôi xòe hình bán nguyệt, màu sắc rực rỡ, hiếu chiến nhưng rất đẹp. Phù hợp nuôi hồ riêng.', 150000, 25, 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400', 1)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Neon Tetra', N'Cá Neon Tetra nhập khẩu Brazil. Thân nhỏ xinh, sọc xanh neon và đỏ rực rỡ nổi bật trong hồ. Nuôi đàn 10-20 con rất đẹp.', 15000, 200, 'https://images.unsplash.com/photo-1520637836993-5df0f6dd3d6c?w=400', 1)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Thần Tiên Đỏ (Discus)', N'Cá Discus - Vua của hồ cá. Nhập khẩu Malaysia, màu đỏ cam rực rỡ, tròn dẹt như đĩa. Yêu cầu nước mềm, nhiệt độ 28-30 độ C.', 850000, 12, 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400', 1)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Chuột Corydoras', N'Cá Corydoras dọn vệ sinh đáy hồ. Thân nhỏ, râu dài, di chuyển duyên dáng. Rất hiền lành, hợp nuôi chung nhiều loại cá khác.', 25000, 80, 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400', 1)"

# Cá Biển (CatId = 2)
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Hề Nemo (Nemo Cam)', N'Cá Hề Nemo chính hãng - Amphiprioninae. Màu cam trắng đặc trưng, thân thiện với san hô. Hình mẫu nhân vật Nemo trong phim hoạt hình nổi tiếng.', 320000, 18, 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400', 2)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Bướm Biển', N'Cá Bướm biển Chaetodonidae màu vàng đen cực kỳ rực rỡ. Sống ở rạn san hô, cần hồ muối chuyên dụng.', 480000, 8, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', 2)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Sư Tử Pterois', N'Cá Sư Tử độc đáo với vây gai như mào sư tử. Màu sắc kẻ sọc đỏ trắng đen cực kỳ ấn tượng. Lưu ý: gai có độc, cần xử lý cẩn thận.', 650000, 6, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', 2)"

# Cá Vàng & Koi (CatId = 3)
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Koi Showa Nhật Bản', N'Cá Koi Showa nhập khẩu trực tiếp từ Nhật Bản. Màu trắng đen đỏ tam sắc chuẩn. Kích thước 25-30cm. Mang lại tài lộc và phong thủy tốt.', 2500000, 10, 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400', 3)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Vàng Ryukin Đuôi Kép', N'Cá Vàng Ryukin đuôi kép thuần chủng. Thân tròn mập, đuôi xòe dài uyển chuyển khi bơi. Màu đỏ cam hoặc đỏ trắng. Rất dễ nuôi trong hồ kính.', 180000, 35, 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400', 3)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Cá Koi Kohaku Cao Cấp', N'Cá Koi Kohaku - dòng cá Koi cơ bản và danh giá nhất. Nền trắng với họa tiết đỏ rực rỡ. Kích thước 30-35cm. Thích hợp hồ ngoài trời lớn.', 3200000, 5, 'https://images.unsplash.com/photo-1520637836993-5df0f6dd3d6c?w=400', 3)"

# Phụ Kiện Hồ Cá (CatId = 4)
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Bộ Lọc Canister Fluval 307', N'Máy lọc canister Fluval 307 nhập khẩu Canada. Lưu lượng 550L/h, thích hợp hồ 70-300L. Êm ái, tiết kiệm điện, vật liệu lọc đầy đủ.', 2800000, 8, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', 4)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Đèn LED Chuyên Aqua Chihiros', N'Đèn LED Chihiros WRGB II chuyên dụng cho hồ thủy sinh. Full spectrum ánh sáng tự nhiên, hẹn giờ tự động, điều chỉnh màu sắc qua app điện thoại.', 1650000, 15, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', 4)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Sỏi Nền ADA Amazonia', N'Sỏi nền ADA Amazonia nhập khẩu Nhật Bản. Giàu dinh dưỡng cho cây thủy sinh, ổn định pH nước. Dùng cho hồ thủy sinh lá nhỏ và cây thảm.', 320000, 40, 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400', 4)"

# Thức Ăn & Dinh Dưỡng (CatId = 5)
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Thức Ăn Cá Betta Hikari', N'Thức ăn cao cấp cho cá Betta nhãn hiệu Hikari Nhật Bản. Dạng viên nổi, giàu protein và vitamin. Tăng cường màu sắc, tăng đề kháng bệnh tật.', 85000, 60, 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400', 5)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Thức Ăn Cá Koi Sera', N'Thức ăn Koi Sera Flore Color chuyên tăng màu. Dạng viên nổi, không làm bẩn nước. Hàm lượng carotenoid cao giúp màu đỏ cam của Koi rực rỡ hơn.', 120000, 45, 'https://images.unsplash.com/photo-1520637836993-5df0f6dd3d6c?w=400', 5)"
Exec "INSERT INTO Products (Name, Description, Price, StockQuantity, ImageUrl, CategoryProductId) VALUES (N'Vitamin C & Khoáng Hồ Cá', N'Bổ sung vitamin C và khoáng chất thiết yếu cho cá cảnh. Tăng sức đề kháng, giúp cá khỏe mạnh, ổn định hệ miễn dịch. Dạng lỏng, dễ sử dụng.', 65000, 90, 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400', 5)"

Write-Host "DONE: 5 danh muc + 16 san pham ca canh da duoc them thanh cong!" -ForegroundColor Green
