using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class PolicyType
    {
        public int Id { get; set; }
        public string Type { get; set; } = null!;
        public bool Status { get; set; }

        public PolicyType()
        {
        }
    }
}
