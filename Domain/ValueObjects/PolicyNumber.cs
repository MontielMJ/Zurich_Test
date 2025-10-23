using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ValueObjects
{
    public record PolicyNumber
    {
        public decimal Value { get; }

        public PolicyNumber(decimal value)
        {
            if (string.IsNullOrWhiteSpace(value.ToString()))
                throw new Exception("El número de póliza no puede estar vacío.");

            if (value.ToString().Length > 1)
                throw new Exception("El número de póliza debe tener al menos 1 caracter.");

            Value = value;
        }

    }
}
