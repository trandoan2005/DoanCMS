using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public OrderApiController(CmsDbContext context)
        {
            _context = context;
        }

        // GET: api/orderapi - Lấy danh sách đơn hàng (dành cho admin nếu cần)
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

        // POST: api/orderapi - Đặt hàng từ Frontend
        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống!" });

            if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin!" });

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

            // Tạo chi tiết đơn hàng
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

    public class PlaceOrderRequest
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
