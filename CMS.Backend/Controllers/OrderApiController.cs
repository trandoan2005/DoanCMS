using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý và Đặt hàng (Dành cho khách hàng đặt hàng từ Frontend và Admin quản trị)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public OrderApiController(CmsDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách toàn bộ đơn hàng (Dành cho quản trị viên)
        /// </summary>
        /// <returns>Danh sách các đơn hàng bao gồm thông tin khách hàng, số lượng và tổng tiền</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    Customer = new { o.Customer!.FullName, o.Customer.Email, o.Customer.Phone },
                    TotalAmount = o.OrderDetails!.Sum(od => od.Quantity * od.UnitPrice),
                    ItemCount = o.OrderDetails!.Sum(od => od.Quantity)
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>
        /// Lấy danh sách đơn hàng của một khách hàng cụ thể
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    TotalAmount = o.OrderDetails!.Sum(od => od.Quantity * od.UnitPrice),
                    ItemCount = o.OrderDetails!.Sum(od => od.Quantity),
                    Items = o.OrderDetails!.Select(od => new {
                        ProductName = od.Product!.Name,
                        od.Quantity,
                        od.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>
        /// Đặt hàng từ Frontend (Tự động đăng ký/cập nhật thông tin khách hàng và tạo đơn hàng)
        /// </summary>
        /// <param name="request">Thông tin khách đặt hàng và danh sách sản phẩm mua</param>
        /// <returns>Kết quả đặt hàng bao gồm ID đơn hàng và tổng giá trị đơn hàng</returns>
        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống!" });

            if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin!" });

            // Kiểm tra tồn kho trước khi đặt hàng
            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest(new { message = $"Sản phẩm ID = {item.ProductId} không tồn tại." });

                if (product.StockQuantity < item.Quantity)
                    return BadRequest(new { message = $"Sản phẩm \"{product.Name}\" chỉ còn {product.StockQuantity} trong kho, không đủ số lượng yêu cầu ({item.Quantity})." });
            }

            // Tìm hoặc tạo customer
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email);

            if (customer == null)
            {
                customer = new Customer
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    Phone = request.Phone ?? "",
                    Address = request.Address ?? "",
                    Password = "khach" // mật khẩu mặc định cho khách
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Cập nhật thông tin nếu đã tồn tại
                customer.FullName = request.FullName;
                customer.Phone = request.Phone ?? customer.Phone;
                customer.Address = request.Address ?? customer.Address;
            }

            // Tạo đơn hàng
            var order = new Order
            {
                CustomerId = customer.Id,
                OrderDate = DateTime.Now,
                Status = 0, // Chờ xử lý
                Notes = request.Notes
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Tạo chi tiết đơn hàng và trừ tồn kho
            decimal totalAmount = 0;
            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) continue;

                var unitPrice = product.Price;
                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice
                };
                _context.OrderDetails.Add(detail);
                totalAmount += unitPrice * item.Quantity;

                // Trừ tồn kho
                product.StockQuantity -= item.Quantity;
            }
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đặt hàng thành công!",
                orderId = order.Id,
                totalAmount
            });
        }
    }

    /// <summary>
    /// Thông tin yêu cầu đặt hàng mới
    /// </summary>
    public class PlaceOrderRequest
    {
        /// <summary>
        /// Họ tên đầy đủ của người nhận hàng
        /// </summary>
        public string FullName { get; set; } = "";

        /// <summary>
        /// Địa chỉ Email liên hệ
        /// </summary>
        public string Email { get; set; } = "";

        /// <summary>
        /// Số điện thoại người nhận
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// Địa chỉ giao hàng
        /// </summary>
        public string? Address { get; set; }

        /// <summary>
        /// Ghi chú đơn hàng (ví dụ: giao giờ hành chính)
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Danh sách các sản phẩm và số lượng tương ứng cần mua
        /// </summary>
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    /// <summary>
    /// Thông tin từng sản phẩm trong yêu cầu đặt hàng
    /// </summary>
    public class OrderItemRequest
    {
        /// <summary>
        /// ID sản phẩm
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Số lượng mua
        /// </summary>
        public int Quantity { get; set; }
    }
}