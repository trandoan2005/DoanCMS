using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập đường dẫn hình ảnh")]
        [Display(Name = "Hình Ảnh")]
        public string ImageUrl { get; set; }

        [Display(Name = "Nhãn (Badge)")]
        public string Badge { get; set; }

        [Display(Name = "Tiêu đề 1")]
        public string Title1 { get; set; }

        [Display(Name = "Tiêu đề 2")]
        public string Title2 { get; set; }

        [Display(Name = "Mô tả")]
        public string Description { get; set; }

        [Display(Name = "Thứ tự hiển thị")]
        public int DisplayOrder { get; set; } = 1;

        [Display(Name = "Kích hoạt?")]
        public bool IsActive { get; set; } = true;
    }
}
