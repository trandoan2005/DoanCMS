using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý và Lấy thông tin bài viết (Tin tức, Blog xu hướng)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PostApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public PostApiController(CmsDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách toàn bộ các bài viết kèm thông tin danh mục
        /// </summary>
        /// <returns>Danh sách bài viết</returns>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .ToListAsync();
            return Ok(posts);
        }

        /// <summary>
        /// Lấy chi tiết bài viết theo ID kèm thông tin danh mục
        /// </summary>
        /// <param name="id">ID bài viết</param>
        /// <returns>Thông tin chi tiết bài viết</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound();
            return Ok(post);
        }

        /// <summary>
        /// Thêm mới một bài viết
        /// </summary>
        /// <param name="post">Thông tin bài viết cần thêm</param>
        /// <returns>Bài viết vừa được tạo</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post post)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Kiểm tra danh mục tồn tại
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == post.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Danh mục có ID = {post.CategoryId} không tồn tại." });

            post.CreatedDate = DateTime.Now;

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
        }

        /// <summary>
        /// Cập nhật thông tin bài viết theo ID
        /// </summary>
        /// <param name="id">ID bài viết cần cập nhật</param>
        /// <param name="post">Thông tin bài viết mới</param>
        /// <returns>Bài viết sau khi cập nhật</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Post post)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _context.Posts.FindAsync(id);
            if (existing == null) return NotFound();

            // Kiểm tra danh mục tồn tại
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == post.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Danh mục có ID = {post.CategoryId} không tồn tại." });

            existing.Title = post.Title;
            existing.Content = post.Content;
            existing.ImageUrl = post.ImageUrl;
            existing.CategoryId = post.CategoryId;
            // Không cập nhật CreatedDate

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        /// <summary>
        /// Xóa bài viết theo ID
        /// </summary>
        /// <param name="id">ID bài viết cần xóa</param>
        /// <returns>Kết quả xóa</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa bài viết '{post.Title}' thành công." });
        }
    }
}