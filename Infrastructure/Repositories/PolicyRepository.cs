using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PolicyRepository : IPolicyRepository
    {
        private readonly ZurichDbContext _context;

        public PolicyRepository(ZurichDbContext context)
        {
            this._context = context;
        }

        public async  Task<Policy> AddPolizaPorClienteIdAsync(Policy policy, int idClient)
        {
            await _context.Policies.AddAsync(policy);
            await _context.SaveChangesAsync();
            return policy;
        }

        public async Task DeletePolizaClienteIdAsync(int idPolicy)
        {
            var policy = await _context.Policies.FindAsync(idPolicy);
            if (policy != null)
            {
                _context.Policies.Remove(policy);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Policy>> GetAllPolicies()
        {
            var policies = await _context.Policies.ToListAsync();
            return policies;
        }

        public async Task<List<Policy>> ObtenerPolizasPorClienteIdAsync(int idClient)
        {
             var policies = await _context.Policies.Where(p => p.IdClient == idClient).ToListAsync();
            return policies;
        }

        public async Task<Policy> ObtenerPolizasPorPolizaIdAsync(int id)
        {
            var policies = await _context.Policies.Where(p => p.Id == id).FirstOrDefaultAsync();
            return policies;
        }

        public async Task UpdatePolizaPorClienteAsync(Policy policy, int id)
        {
           await _context.Policies.Where(p => p.Id == id)
                .ExecuteUpdateAsync(p => p
                    .SetProperty(pr => pr.Folio, policy.Folio)
                    .SetProperty(pr => pr.IdTypePolicy, policy.IdTypePolicy)
                    .SetProperty(pr => pr.InitDate, policy.InitDate)
                    .SetProperty(pr => pr.EndDate, policy.EndDate)
                    .SetProperty(pr => pr.InsuredAmount, policy.InsuredAmount)
                    .SetProperty(pr => pr.Status, policy.Status)
                    .SetProperty(pr => pr.IdClient, policy.IdClient)
                );
            await _context.SaveChangesAsync();
        }
    }
}
