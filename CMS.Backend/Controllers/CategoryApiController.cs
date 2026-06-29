using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý danh mục bài viết
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public CategoryApiController(CmsDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả các danh mục bài viết
        /// </summary>
        /// <returns>Danh sách các danh mục bài viết</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        /// <summary>
        /// Lấy chi tiết danh mục bài viết theo ID
        /// </summary>
        /// <param name="id">ID danh mục</param>
        /// <returns>Thông tin chi tiết danh mục bài viết</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        /// <summary>
        /// Thêm mới một danh mục bài viết
        /// </summary>
        /// <param name="category">Thông tin danh mục cần thêm</param>
        /// <returns>Danh mục vừa được tạo</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category category)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        /// <summary>
        /// Cập nhật thông tin danh mục bài viết theo ID
        /// </summary>
        /// <param name="id">ID danh mục cần cập nhật</param>
        /// <param name="category">Thông tin danh mục mới</param>
        /// <returns>Danh mục sau khi cập nhật</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category category)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _context.Categories.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = category.Name;
            existing.Description = category.Description;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        /// <summary>
        /// Xóa danh mục bài viết theo ID
        /// </summary>
        /// <param name="id">ID danh mục cần xóa</param>
        /// <returns>Kết quả xóa</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa danh mục '{category.Name}' thành công." });
        }
    }
}