using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models
{
    public class UserProfileViewModel
    {
        public string Id { get; set; }
        
        [Display(Name = "Tên đăng nhập")]
        public string UserName { get; set; }
        
        [Display(Name = "Email")]
        public string Email { get; set; }
        
        [Display(Name = "Số điện thoại")]
        public string PhoneNumber { get; set; }
        
        public IList<string> Roles { get; set; }
    }
}
