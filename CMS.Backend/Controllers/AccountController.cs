using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
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

        // Tạo tài khoản Admin lần đầu
        public async Task<IActionResult> SeedAdmin()
        {
            var user = await _userManager.FindByNameAsync("admin");
            if (user == null)
            {
                user = new IdentityUser
                {
                    UserName = "admin",
                    Email = "admin@doancms.com"
                };
                await _userManager.CreateAsync(user, "Admin@123");
            }
            return Content("Tạo tài khoản admin thành công! Username: admin | Password: Admin@123");
        }
    }
}