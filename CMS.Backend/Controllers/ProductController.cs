using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ProductController : Controller
    {
        private readonly CmsDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(CmsDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: Product
        public async Task<IActionResult> Index()
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .ToListAsync();
            return View(products);
        }

        // GET: Product/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return View(product);
        }

        // GET: Product/Create
        public IActionResult Create()
        {
            ViewData["CategoryProductId"] = new SelectList(_context.CategoryProducts, "Id", "Name");
            return View();
        }

        // POST: Product/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
            [Bind("Id,Name,Description,Price,StockQuantity,CategoryProductId")] Product product,
            IFormFile? imageFile,
            string? imageUrl)
        {
            if (ModelState.IsValid)
            {
                // Ưu tiên file upload, sau đó mới dùng URL
                product.ImageUrl = await SaveImageAsync(imageFile, imageUrl);

                _context.Add(product);
                await _context.SaveChangesAsync();
                TempData["Success"] = $"Đã thêm cá cảnh \"{product.Name}\" thành công! 🐠";
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryProductId"] = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // GET: Product/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            ViewData["CategoryProductId"] = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // POST: Product/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(
            int id,
            [Bind("Id,Name,Description,Price,StockQuantity,ImageUrl,CategoryProductId")] Product product,
            IFormFile? imageFile,
            string? imageUrl)
        {
            if (id != product.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    // Nếu có file mới thì dùng, không thì giữ imageUrl cũ (đã bind)
                    if (imageFile != null && imageFile.Length > 0)
                        product.ImageUrl = await SaveImageAsync(imageFile, null);
                    else if (!string.IsNullOrEmpty(imageUrl))
                        product.ImageUrl = imageUrl;
                    // Nếu cả 2 đều rỗng thì giữ nguyên ImageUrl cũ đã bind

                    _context.Update(product);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = $"Đã cập nhật \"{product.Name}\" thành công! 🐠";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Products.Any(e => e.Id == product.Id)) return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryProductId"] = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // GET: Product/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return View(product);
        }

        // POST: Product/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                // Xóa file ảnh nếu là ảnh upload
                DeleteLocalImage(product.ImageUrl);
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                TempData["Success"] = $"Đã xóa \"{product.Name}\" thành công!";
            }
            return RedirectToAction(nameof(Index));
        }

        // ── Helper: lưu file ảnh vào wwwroot/uploads ──
        private async Task<string?> SaveImageAsync(IFormFile? imageFile, string? fallbackUrl)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                var ext = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
                var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                if (!allowed.Contains(ext))
                {
                    TempData["Error"] = "Chỉ chấp nhận file ảnh: jpg, jpeg, png, gif, webp";
                    return fallbackUrl;
                }

                var fileName = $"{Guid.NewGuid()}{ext}";
                var folder   = Path.Combine(_env.WebRootPath, "uploads");
                Directory.CreateDirectory(folder);
                var filePath = Path.Combine(folder, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);

                return $"/uploads/{fileName}";
            }
            return string.IsNullOrEmpty(fallbackUrl) ? null : fallbackUrl;
        }

        private void DeleteLocalImage(string? imageUrl)
        {
            if (!string.IsNullOrEmpty(imageUrl) && imageUrl.StartsWith("/uploads/"))
            {
                var path = Path.Combine(_env.WebRootPath, imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }
        }
    }
}
