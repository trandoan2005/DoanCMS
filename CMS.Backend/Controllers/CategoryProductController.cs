using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoryProductController : Controller
    {
        private readonly CmsDbContext _context;

        public CategoryProductController(CmsDbContext context)
        {
            _context = context;
        }

        // GET: CategoryProduct
        public async Task<IActionResult> Index()
        {
            var categories = await _context.CategoryProducts.ToListAsync();
            return View(categories);
        }

        // GET: CategoryProduct/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.CategoryProducts
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return NotFound();

            return View(category);
        }

        // GET: CategoryProduct/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CategoryProduct/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Description")] CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.Add(categoryProduct);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Thêm danh mục sản phẩm thành công!";
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // GET: CategoryProduct/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.CategoryProducts.FindAsync(id);
            if (category == null) return NotFound();

            return View(category);
        }

        // POST: CategoryProduct/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Description")] CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(categoryProduct);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Cập nhật danh mục sản phẩm thành công!";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.CategoryProducts.Any(e => e.Id == categoryProduct.Id))
                        return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(categoryProduct);
        }

        // GET: CategoryProduct/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.CategoryProducts
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return NotFound();

            return View(category);
        }

        // POST: CategoryProduct/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var category = await _context.CategoryProducts.FindAsync(id);
            if (category != null)
            {
                _context.CategoryProducts.Remove(category);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Xóa danh mục sản phẩm thành công!";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
