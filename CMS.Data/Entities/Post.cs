//Sinh viên : Trần Văn Đoàn
//MSSV:2123110210
//Lớp:CCQ2311F
//Ngày tạo: 15/05/2026
//Mô tả: Quản lí Bài Viết
namespace CMS.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int CategoryId { get; set; }
        public virtual Category? Category { get; set; }
    }
}