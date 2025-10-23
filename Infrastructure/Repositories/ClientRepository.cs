using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly ZurichDbContext _context;
        public ClientRepository(ZurichDbContext context)
        {
            this._context = context;
        }
        public async Task<List<Client>> ObtenerClientesAsync()
        {
            return await _context.Clients.Include(c => c.Policies).ToListAsync();
        }
        public async Task<Client?> ObtenerClientePorIdAsync(int id)
        {
            return await _context.Clients.Include(c => c.Policies).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Client> AddClientAsync(Client client)
        {
            await _context.Clients.AddAsync(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task DeleteClientAsync(int id)
        {
            await _context.Clients.Where(c => c.Id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
        }

        public async Task UpdateClientAsync(Client client)
        {
          await  _context.Clients.Where(c => c.Id == client.Id)
                .ExecuteUpdateAsync(c => c
                    .SetProperty(p => p.Fullname, client.Fullname)
                    .SetProperty(p => p.Email, client.Email)
                    .SetProperty(p => p.Phone, client.Phone)
                    .SetProperty(p => p.IdentificationNumber, client.IdentificationNumber)
                    .SetProperty(p => p.Status, client.Status)
                );
        }
    }
}
