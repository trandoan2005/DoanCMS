using System.Diagnostics;
using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly CmsDbContext _context;

        public HomeController(ILogger<HomeController> logger, CmsDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            // Thống kê tổng quan
            ViewBag.TotalProducts      = await _context.Products.CountAsync();
            ViewBag.TotalPosts         = await _context.Posts.CountAsync();
            ViewBag.TotalCustomers     = await _context.Customers.CountAsync();
            ViewBag.TotalOrders        = await _context.Orders.CountAsync();
            ViewBag.TotalCategories    = await _context.Categories.CountAsync();
            ViewBag.TotalCategoryProds = await _context.CategoryProducts.CountAsync();

            // Đơn hàng theo trạng thái
            ViewBag.PendingOrders  = await _context.Orders.CountAsync(o => o.Status == 0);
            ViewBag.ShippingOrders = await _context.Orders.CountAsync(o => o.Status == 1);
            ViewBag.DoneOrders     = await _context.Orders.CountAsync(o => o.Status == 2);

            // Tổng doanh thu (chỉ tính đơn đã xong)
            ViewBag.TotalRevenue = await _context.OrderDetails
                .Where(od => od.Order != null && od.Order.Status == 2)
                .SumAsync(od => (decimal?)od.Quantity * od.UnitPrice) ?? 0;

            // 5 đơn hàng mới nhất
            ViewBag.RecentOrders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .ToListAsync();

            // 5 sản phẩm tồn kho thấp nhất (còn hàng)
            ViewBag.LowStockProducts = await _context.Products
                .Where(p => p.StockQuantity > 0)
                .OrderBy(p => p.StockQuantity)
                .Take(5)
                .ToListAsync();

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
