using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Users
    {
        public int Id { get; set; }
        public string User { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int IdRol { get; set; }
        public DateTime CreateAt { get; set; }
        public bool Status { get; set; }


        public Roles? Role { get; set; }
    }
}
