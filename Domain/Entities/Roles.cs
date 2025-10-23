using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Roles
    {
        public int Id { get; set; }
        public string Rol { get; set; } = null!;
        public DateTime CreateAt { get; set; }
        public bool Status { get; set; }
        public ICollection<Users> Users { get; set; } = new List<Users>();
        public Roles()
        {
        }
    }
}
