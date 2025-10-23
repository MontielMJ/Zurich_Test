using Domain.Entities;
using Domain.Interfaces;

namespace Application.Handler
{
    public class PolizaHandler
    {        
        private readonly IPolicyRepository _polizaRepo;

        public PolizaHandler(IPolicyRepository polizaRepo)
        {
            this._polizaRepo = polizaRepo;
        }

        public async Task<List<Policy>> ObtenerPolizasPorClienteIdAsync(int idClient)
        {
            var polizas = await _polizaRepo.ObtenerPolizasPorClienteIdAsync(idClient);
            if (polizas == null)
            {
                throw new Exception("Poliza no encontrada");
            }
            return polizas;
        }

        public async Task<Policy> AddPolizaPorClienteIdAsync(Policy policy, int idClient)
        {
            return await _polizaRepo.AddPolizaPorClienteIdAsync(policy, idClient);
        }
        public async Task DeletePolizaClienteIdAsync(int idPolicy, int idClient)
        {
            await _polizaRepo.DeletePolizaClienteIdAsync(idPolicy, idClient);
        }
        public async Task UpdatePolizaPorClienteAsync(Policy policy, int idClient)
        {
            await _polizaRepo.UpdatePolizaPorClienteAsync(policy, idClient);
        }
   
    }
}
