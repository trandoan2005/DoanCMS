using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class OrderController : Controller
    {
        private readonly CmsDbContext _context;

        public OrderController(CmsDbContext context)
        {
            _context = context;
        }

        // GET: Order - Danh sách đơn hàng
        public async Task<IActionResult> Index(int? status)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync();

            ViewBag.CurrentStatus = status;
            ViewBag.TotalOrders = await _context.Orders.CountAsync();
            ViewBag.PendingOrders = await _context.Orders.CountAsync(o => o.Status == 0);
            ViewBag.ShippingOrders = await _context.Orders.CountAsync(o => o.Status == 1);
            ViewBag.DoneOrders = await _context.Orders.CountAsync(o => o.Status == 2);

            return View(orders);
        }

        // GET: Order/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                        .ThenInclude(p => p.CategoryProduct)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // POST: Order/ChangeStatus
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangeStatus(int id, int newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = newStatus;
            await _context.SaveChangesAsync();

            var statusText = newStatus switch
            {
                0 => "Chờ xử lý",
                1 => "Đang giao",
                2 => "Đã giao",
                _ => "Không rõ"
            };
            TempData["Success"] = $"Cập nhật trạng thái đơn #{id} thành '{statusText}' thành công!";
            return RedirectToAction(nameof(Details), new { id });
        }

        // POST: Order/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order != null)
            {
                _context.OrderDetails.RemoveRange(order.OrderDetails!);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                TempData["Success"] = $"Đã xóa đơn hàng #{id}!";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
