using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý danh mục sản phẩm (cá cảnh, thức ăn, phụ kiện,...)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public CategoryProductApiController(CmsDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả các danh mục sản phẩm
        /// </summary>
        /// <returns>Danh sách các danh mục sản phẩm</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.CategoryProducts.ToListAsync();
            return Ok(categories);
        }

        /// <summary>
        /// Lấy chi tiết danh mục sản phẩm theo ID
        /// </summary>
        /// <param name="id">ID danh mục sản phẩm</param>
        /// <returns>Thông tin chi tiết danh mục sản phẩm</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.CategoryProducts.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        /// <summary>
        /// Thêm mới một danh mục sản phẩm
        /// </summary>
        /// <param name="category">Thông tin danh mục sản phẩm cần thêm</param>
        /// <returns>Danh mục sản phẩm vừa được tạo</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct category)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.CategoryProducts.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        /// <summary>
        /// Cập nhật thông tin danh mục sản phẩm theo ID
        /// </summary>
        /// <param name="id">ID danh mục sản phẩm cần cập nhật</param>
        /// <param name="category">Thông tin danh mục sản phẩm mới</param>
        /// <returns>Danh mục sản phẩm sau khi cập nhật</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct category)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _context.CategoryProducts.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = category.Name;
            existing.Description = category.Description;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        /// <summary>
        /// Xóa danh mục sản phẩm theo ID
        /// </summary>
        /// <param name="id">ID danh mục sản phẩm cần xóa</param>
        /// <returns>Kết quả xóa</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoryProducts.FindAsync(id);
            if (category == null) return NotFound();

            // Kiểm tra còn sản phẩm thuộc danh mục này không
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryProductId == id);
            if (hasProducts)
                return BadRequest(new { message = "Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này." });

            _context.CategoryProducts.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa danh mục sản phẩm '{category.Name}' thành công." });
        }
    }
}