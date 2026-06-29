using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class BannersController : Controller
    {
        private readonly CmsDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BannersController(CmsDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IActionResult> Index()
        {
            var banners = await _context.Banners.OrderBy(b => b.DisplayOrder).ToListAsync();
            return View(banners);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Badge,Title1,Title2,Description,DisplayOrder,IsActive")] Banner banner, IFormFile? imageFile, string? imageUrl)
        {
            if (ModelState.IsValid)
            {
                banner.ImageUrl = await SaveImageAsync(imageFile, imageUrl) ?? string.Empty;
                _context.Add(banner);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Thêm banner thành công!";
                return RedirectToAction(nameof(Index));
            }
            return View(banner);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            return View(banner);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ImageUrl,Badge,Title1,Title2,Description,DisplayOrder,IsActive")] Banner banner, IFormFile? imageFile, string? imageUrl)
        {
            if (id != banner.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    if (imageFile != null && imageFile.Length > 0)
                        banner.ImageUrl = await SaveImageAsync(imageFile, null) ?? string.Empty;
                    else if (!string.IsNullOrEmpty(imageUrl))
                        banner.ImageUrl = imageUrl;

                    _context.Update(banner);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Cập nhật banner thành công!";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Banners.Any(e => e.Id == banner.Id)) return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(banner);
        }

        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            return View(banner);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner != null)
            {
                DeleteLocalImage(banner.ImageUrl);
                _context.Banners.Remove(banner);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Xoá banner thành công!";
            }
            return RedirectToAction(nameof(Index));
        }

        private async Task<string?> SaveImageAsync(IFormFile? imageFile, string? fallbackUrl)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                var ext = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
                var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                if (!allowed.Contains(ext)) return fallbackUrl;

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
