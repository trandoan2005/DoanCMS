// Sinh viên : Trần Văn Đoàn
// MSSV: 2123110202
// Lớp: CCQ2311F
// Ngày tạo: 22/05/2026
// Mô tả: Web API Controller cho Danh Mục (Category)

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        // Lấy toàn bộ danh sách danh mục
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/categories/5
        // Lấy một danh mục theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .FirstOrDefaultAsync();

            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục có ID = {id}" });

            return Ok(category);
        }

        // POST: api/categories
        // Thêm mới một danh mục
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Categories.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, new
            {
                model.Id,
                model.Name,
                model.Description
            });
        }

        // PUT: api/categories/5
        // Cập nhật một danh mục theo ID
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.Categories.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Không tìm thấy danh mục có ID = {id}" });

            existing.Name = model.Name;
            existing.Description = model.Description;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật danh mục thành công!",
                data = new { existing.Id, existing.Name, existing.Description }
            });
        }

        // DELETE: api/categories/5
        // Xóa một danh mục theo ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = $"Không tìm thấy danh mục có ID = {id}" });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa danh mục '{category.Name}' thành công!" });
        }
    }
}
