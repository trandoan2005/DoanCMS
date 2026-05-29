//Sinh viên : Trần Văn Đoàn
//MSSV:2123110210
//Lớp:CCQ2311F
//Ngày tạo: 15/05/2026
//Mô tả: Quản lí Danh Mục
using System.Collections.Generic;

namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<Post>? Posts { get; set; }
    }
}