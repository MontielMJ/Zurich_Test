using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IClientRepository
    {
        Task<List<Client>> ObtenerClientesAsync();
        Task<Client?> ObtenerClientePorIdAsync(int id);
        Task<Client> AddClientAsync(Client client);
        Task DeleteClientAsync(int id);
        Task UpdateClientAsync(Client client);

    }
}
