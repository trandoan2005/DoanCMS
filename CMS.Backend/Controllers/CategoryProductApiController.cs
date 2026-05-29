using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public CategoryProductApiController(CmsDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.CategoryProducts.ToListAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.CategoryProducts.FindAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }
    }
}
