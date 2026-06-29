using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    /// <summary>
    /// API Quản lý Tài khoản Khách hàng (Đăng ký, Đăng nhập)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerApiController : ControllerBase
    {
        private readonly CmsDbContext _context;

        public CustomerApiController(CmsDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Đăng nhập tài khoản khách hàng
        /// </summary>
        /// <param name="model">Thông tin đăng nhập (Email, Mật khẩu)</param>
        /// <returns>Thông tin khách hàng sau khi đăng nhập thành công</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ email và mật khẩu!" });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == model.Email.ToLower());

            if (customer == null || !BCrypt.Net.BCrypt.Verify(model.Password, customer.Password))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        /// <summary>
        /// Đăng ký tài khoản khách hàng mới
        /// </summary>
        /// <param name="model">Thông tin đăng ký khách hàng mới</param>
        /// <returns>Thông tin tài khoản khách hàng vừa được tạo</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ các thông tin bắt buộc!" });
            }

            // Kiểm tra email trùng
            var exists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == model.Email.ToLower());
            if (exists)
            {
                return BadRequest(new { message = "Email này đã được đăng ký bởi tài khoản khác!" });
            }

            var customer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Address = model.Address,
                Password = BCrypt.Net.BCrypt.HashPassword(model.Password) // Đã băm mật khẩu
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        /// <summary>
        /// Cập nhật thông tin tài khoản khách hàng
        /// </summary>
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] RegisterDto model)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng!" });
            }

            if (string.IsNullOrEmpty(model.FullName) || string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { message = "Họ tên và Email không được để trống!" });
            }

            // Kiểm tra trùng email với người khác
            var emailExists = await _context.Customers.AnyAsync(c => c.Email.ToLower() == model.Email.ToLower() && c.Id != id);
            if (emailExists)
            {
                return BadRequest(new { message = "Email này đã được sử dụng bởi tài khoản khác!" });
            }

            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone ?? "";
            customer.Address = model.Address ?? "";
            
            if (!string.IsNullOrEmpty(model.Password))
            {
                customer.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }
    }

    /// <summary>
    /// Thông tin yêu cầu đăng nhập khách hàng
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// Địa chỉ Email đăng nhập
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// Mật khẩu đăng nhập
        /// </summary>
        public string? Password { get; set; }
    }

    /// <summary>
    /// Thông tin yêu cầu đăng ký khách hàng mới
    /// </summary>
    public class RegisterDto
    {
        /// <summary>
        /// Họ và tên đầy đủ
        /// </summary>
        public string? FullName { get; set; }

        /// <summary>
        /// Địa chỉ Email
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// Số điện thoại liên lạc
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// Địa chỉ giao hàng mặc định
        /// </summary>
        public string? Address { get; set; }

        /// <summary>
        /// Mật khẩu tài khoản
        /// </summary>
        public string? Password { get; set; }
    }
}
