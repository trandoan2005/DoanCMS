using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public BannerApiController(CmsDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetActiveBanners()
        {
            var banners = _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.DisplayOrder)
                .Select(b => new {
                    b.Id,
                    b.ImageUrl,
                    b.Badge,
                    b.Title1,
                    b.Title2,
                    b.Description
                })
                .ToList();

            return Ok(banners);
        }
    }
}
