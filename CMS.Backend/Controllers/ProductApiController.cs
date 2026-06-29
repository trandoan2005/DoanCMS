using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý và Tra cứu thông tin Sản phẩm (Cá cảnh, thức ăn, phụ kiện,...)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public ProductApiController(CmsDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách tất cả các sản phẩm kèm theo danh mục sản phẩm tương ứng
        /// </summary>
        /// <returns>Danh sách các sản phẩm</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .ToListAsync();
            return Ok(products);
        }

        /// <summary>
        /// Lấy thông tin chi tiết một sản phẩm theo ID kèm danh mục tương ứng
        /// </summary>
        /// <param name="id">ID sản phẩm cần lấy</param>
        /// <returns>Thông tin chi tiết sản phẩm</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        /// <summary>
        /// Lấy danh sách sản phẩm thuộc một danh mục cụ thể theo ID danh mục
        /// </summary>
        /// <param name="categoryId">ID danh mục sản phẩm (ví dụ: 1 = Cá cảnh, 2 = Thức ăn,...)</param>
        /// <returns>Danh sách các sản phẩm thuộc danh mục được chọn</returns>
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryId)
                .ToListAsync();
            return Ok(products);
        }

        /// <summary>
        /// Thêm mới một sản phẩm
        /// </summary>
        /// <param name="product">Thông tin sản phẩm cần thêm</param>
        /// <returns>Sản phẩm vừa được tạo</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Kiểm tra danh mục sản phẩm tồn tại
            var categoryExists = await _context.CategoryProducts.AnyAsync(c => c.Id == product.CategoryProductId);
            if (!categoryExists)
                return BadRequest(new { message = $"Danh mục sản phẩm có ID = {product.CategoryProductId} không tồn tại." });

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        /// <summary>
        /// Cập nhật thông tin sản phẩm theo ID
        /// </summary>
        /// <param name="id">ID sản phẩm cần cập nhật</param>
        /// <param name="product">Thông tin sản phẩm mới</param>
        /// <returns>Sản phẩm sau khi cập nhật</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            // Kiểm tra danh mục sản phẩm tồn tại
            var categoryExists = await _context.CategoryProducts.AnyAsync(c => c.Id == product.CategoryProductId);
            if (!categoryExists)
                return BadRequest(new { message = $"Danh mục sản phẩm có ID = {product.CategoryProductId} không tồn tại." });

            existing.Name = product.Name;
            existing.Description = product.Description;
            existing.Price = product.Price;
            existing.StockQuantity = product.StockQuantity;
            existing.ImageUrl = product.ImageUrl;
            existing.CategoryProductId = product.CategoryProductId;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        /// <summary>
        /// Xóa sản phẩm theo ID
        /// </summary>
        /// <param name="id">ID sản phẩm cần xóa</param>
        /// <returns>Kết quả xóa</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa sản phẩm '{product.Name}' thành công." });
        }
    }
}