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
        public PolicyNumber Folio { get; private set; }
        public TypePolicy idTypePolicy { get; private set; }
        public DateTime InitDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public decimal InsuredAmount { get; private set; }
        public int IdClient { get; private set; }
        public bool Status { get; private set; }
        public virtual Client? Client { get; set; }


        protected Policy() { }

        public Policy(PolicyNumber folio, TypePolicy type, DateTime initDate, DateTime endDate, decimal insuredAmount, bool status)
        {
            if (initDate >= endDate)
                throw new Exception("La fecha de inicio debe ser anterior a la fecha de fin.");

            if (insuredAmount <= 0)
                throw new Exception("El monto asegurado debe ser mayor a cero.");

            Folio = folio;
            idTypePolicy = type;
            InitDate = initDate;
            EndDate = endDate;
            InsuredAmount = insuredAmount;
            Status = status;
        }

        public bool EstaVigente() => DateTime.UtcNow >= InitDate && DateTime.UtcNow <= EndDate;

    }
}
