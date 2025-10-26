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

        public async Task<List<Policy>> ObtenerPolizasAsync()
        {
            var polizas = await _polizaRepo.GetAllPolicies();
            if (polizas == null)
            {
                throw new Exception("No hay polizas");
            }
            return polizas;
        }
        public async Task<Policy> ObtenerPolizasPorPolizaIdAsync(int id)
        {
            var polizas = await _polizaRepo.ObtenerPolizasPorPolizaIdAsync(id);
            if (polizas == null)
            {
                throw new Exception("Poliza no encontrada");
            }
            return polizas;
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
        public async Task DeletePolizaClienteIdAsync(int idPolicy)
        {
            await _polizaRepo.DeletePolizaClienteIdAsync(idPolicy);
        }
        public async Task UpdatePolizaPorClienteAsync(Policy policy, int id)
        {
            await _polizaRepo.UpdatePolizaPorClienteAsync(policy, id);
        }
   
    }
}
