using Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Client
    {
        public int Id { get;  set; }

        public string Fullname { get;  set; } = null!;

        public Email Email { get;  set; } = null!;

        public decimal Phone { get;  set; }

        public decimal IdentificationNumber { get;  set; }

        public DateTime CreateAt { get;  set; }

        public bool Status { get;  set; }

        public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();

        public Client() { }
        public Client(string fullname, Email email, decimal phone, decimal identificationNumber, DateTime createAt, bool status) {
        
            this.Fullname = fullname;
            this.Email = email;
            this.Phone = phone;
            this.IdentificationNumber = identificationNumber;
            this.CreateAt = createAt;
            this.Status = status;
        }
    }   
}
