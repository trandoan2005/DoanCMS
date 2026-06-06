using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class PostController : Controller
    {
        private readonly CmsDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PostController(CmsDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: Post
        public async Task<IActionResult> Index()
        {
            var posts = await _context.Posts.Include(p => p.Category).ToListAsync();
            return View(posts);
        }

        // GET: Post/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // GET: Post/Create
        public IActionResult Create()
        {
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        // POST: Post/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
            [Bind("Id,Title,Content,CategoryId")] Post post,
            IFormFile? imageFile,
            string? imageUrl)
        {
            if (ModelState.IsValid)
            {
                post.ImageUrl = await SaveImageAsync(imageFile, imageUrl);
                post.CreatedDate = DateTime.Now;
                _context.Add(post);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Thêm bài viết thành công! 🐟";
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // GET: Post/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Post/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(
            int id,
            [Bind("Id,Title,Content,ImageUrl,CategoryId,CreatedDate")] Post post,
            IFormFile? imageFile,
            string? imageUrl)
        {
            if (id != post.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    if (imageFile != null && imageFile.Length > 0)
                        post.ImageUrl = await SaveImageAsync(imageFile, null);
                    else if (!string.IsNullOrEmpty(imageUrl))
                        post.ImageUrl = imageUrl;

                    _context.Update(post);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Cập nhật bài viết thành công! 🐟";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Posts.Any(e => e.Id == post.Id)) return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // GET: Post/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // POST: Post/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post != null)
            {
                DeleteLocalImage(post.ImageUrl);
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Xóa bài viết thành công!";
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
