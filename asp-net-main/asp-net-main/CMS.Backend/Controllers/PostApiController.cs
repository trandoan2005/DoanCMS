// Sinh viên : Trần Văn Đoàn
// MSSV: 2123110202
// Lớp: CCQ2311F
// Ngày tạo: 22/05/2026
// Mô tả: Web API Controller cho Bài Viết (Post)

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/posts
        // Lấy toàn bộ danh sách bài viết (kèm tên danh mục)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            return Ok(posts);
        }

        // GET: api/posts/5
        // Lấy một bài viết theo ID (kèm tên danh mục)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "Chưa phân loại"
                })
                .FirstOrDefaultAsync();

            if (post == null)
                return NotFound(new { message = $"Không tìm thấy bài viết có ID = {id}" });

            return Ok(post);
        }

        // POST: api/posts
        // Thêm mới một bài viết
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Kiểm tra danh mục tồn tại
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == model.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Danh mục có ID = {model.CategoryId} không tồn tại!" });

            model.CreatedDate = DateTime.Now;

            _context.Posts.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, new
            {
                model.Id,
                model.Title,
                model.Content,
                model.ImageUrl,
                model.CreatedDate,
                model.CategoryId
            });
        }

        // PUT: api/posts/5
        // Cập nhật một bài viết theo ID
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Post model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.Posts.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Không tìm thấy bài viết có ID = {id}" });

            // Kiểm tra danh mục tồn tại
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == model.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Danh mục có ID = {model.CategoryId} không tồn tại!" });

            existing.Title = model.Title;
            existing.Content = model.Content;
            existing.ImageUrl = model.ImageUrl;
            existing.CategoryId = model.CategoryId;
            // Không cập nhật CreatedDate

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật bài viết thành công!",
                data = new
                {
                    existing.Id,
                    existing.Title,
                    existing.Content,
                    existing.ImageUrl,
                    existing.CreatedDate,
                    existing.CategoryId
                }
            });
        }

        // DELETE: api/posts/5
        // Xóa một bài viết theo ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = $"Không tìm thấy bài viết có ID = {id}" });

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa bài viết '{post.Title}' thành công!" });
        }
    }
}
