using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string username, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(username, password, false, false);
            if (result.Succeeded)
            {
                return RedirectToAction("Index", "Home");
            }
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login");
        }

        public IActionResult AccessDenied()
        {
            return View();
        }

        // Tạo tài khoản Admin + debug chi tiết
        public async Task<IActionResult> SeedAdmin()
        {
            var log = new System.Text.StringBuilder();

            // Tạo role Admin nếu chưa có
            bool roleExists = await _roleManager.RoleExistsAsync("Admin");
            log.AppendLine($"Role 'Admin' tồn tại: {roleExists}");
            if (!roleExists)
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole("Admin"));
                log.AppendLine($"Tạo role 'Admin': {(roleResult.Succeeded ? "THÀNH CÔNG" : string.Join(", ", roleResult.Errors.Select(e => e.Description)))}");
            }

            // Tìm user admin
            var user = await _userManager.FindByNameAsync("admin");
            log.AppendLine($"User 'admin' tồn tại: {(user != null ? "CÓ (Id: " + user.Id + ")" : "KHÔNG")}");

            if (user == null)
            {
                user = new IdentityUser { UserName = "admin", Email = "admin@doancms.com" };
                var createResult = await _userManager.CreateAsync(user, "Admin@123");
                log.AppendLine($"Tạo user 'admin': {(createResult.Succeeded ? "THÀNH CÔNG" : string.Join(", ", createResult.Errors.Select(e => e.Description)))}");
            }

            // Gán role
            bool inRole = await _userManager.IsInRoleAsync(user, "Admin");
            log.AppendLine($"User đã có role 'Admin': {inRole}");
            if (!inRole)
            {
                var addRoleResult = await _userManager.AddToRoleAsync(user, "Admin");
                log.AppendLine($"Gán role 'Admin': {(addRoleResult.Succeeded ? "THÀNH CÔNG" : string.Join(", ", addRoleResult.Errors.Select(e => e.Description)))}");
            }

            // Kiểm tra lại
            var roles = await _userManager.GetRolesAsync(user);
            log.AppendLine($"Roles hiện tại của admin: [{string.Join(", ", roles)}]");
            log.AppendLine("---");
            log.AppendLine("Hãy đăng xuất rồi đăng nhập lại để áp dụng quyền mới!");

            return Content(log.ToString(), "text/plain; charset=utf-8");
        }
    }
}