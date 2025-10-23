using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPolicyRepository
    {
        
        Task<List<Policy>> ObtenerPolizasPorClienteIdAsync(int idClient);
        Task<Policy> AddPolizaPorClienteIdAsync(Policy policy, int idClient);
        Task DeletePolizaClienteIdAsync(int idPolicy, int idClient);
        Task UpdatePolizaPorClienteAsync(Policy policy, int idClient);
    }
}
