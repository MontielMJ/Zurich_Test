using Domain.Enums;
using Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Policy
    { 
        public int Id { get; private set; }
        public PolicyNumber Folio { get;  set; }
        public TypePolicy IdTypePolicy { get;  set; }
        public DateTime InitDate { get;  set; }
        public DateTime EndDate { get;  set; }
        public decimal InsuredAmount { get;  set; }
        public int IdClient { get;  set; }
        public bool Status { get;  set; }
        public virtual Client? Client { get; set; }


        public Policy() { }

        public Policy(PolicyNumber folio, TypePolicy idTypePolicy, DateTime initDate, DateTime endDate, decimal insuredAmount, bool status)
        {
            if (initDate >= endDate)
                throw new Exception("La fecha de inicio debe ser anterior a la fecha de fin.");

            if (insuredAmount <= 0)
                throw new Exception("El monto asegurado debe ser mayor a cero.");

            Folio = folio;
            IdTypePolicy = idTypePolicy;
            InitDate = initDate;
            EndDate = endDate;
            InsuredAmount = insuredAmount;
            Status = status;
        }

        public bool EstaVigente() => DateTime.UtcNow >= InitDate && DateTime.UtcNow <= EndDate;

    }
}
