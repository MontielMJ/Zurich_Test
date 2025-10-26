using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;


namespace Application.Handler
{
    public class PolizaHandler
    {
        private readonly IPolicyRepository _polizaRepo;
        private readonly ILogger<ClienteHandler> _logger;
        public PolizaHandler(IPolicyRepository polizaRepo, ILogger<ClienteHandler> logger)
        {
            this._polizaRepo = polizaRepo;
            this._logger = logger;
        }

        public async Task<List<Policy>> ObtenerPolizasAsync()
        {
            var polizas = new List<Policy>();
            try
            {
                polizas = await _polizaRepo.GetAllPolicies(); 
                _logger.LogInformation("Pólizas obtenidas exitosamente");
            }
            catch (Exception)
            {
                _logger.LogError("Error en el Handler-ObtenerPolizasAsync");
            }
            return polizas;
        }
        public async Task<Policy> ObtenerPolizasPorPolizaIdAsync(int id)
        {
            _logger.LogInformation("Iniciando obtención de póliza por ID: {Id}", id);
            var polizas = new Policy();
            try
            {
                polizas = await _polizaRepo.ObtenerPolizasPorPolizaIdAsync(id);
                _logger.LogInformation("Póliza con ID: {Id} obtenida exitosamente", id);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en el Handler-ObtenerPolizasPorPolizaIdAsync", id);
            }
            return polizas;
        }
        public async Task<List<Policy>> ObtenerPolizasPorClienteIdAsync(int idClient)
        {
            var polizas = new List<Policy>();
            try
            {
                polizas = await _polizaRepo.ObtenerPolizasPorClienteIdAsync(idClient);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en el Handler-ObtenerPolizasPorClienteIdAsync", idClient);
            }
            return polizas;
        }

        public async Task<Policy> AddPolizaPorClienteIdAsync(Policy policy, int idClient)
        {
            try
            {
                var newPolicy = await _polizaRepo.AddPolizaPorClienteIdAsync(policy, idClient);
                _logger.LogInformation("Póliza agregada exitosamente para el cliente con ID: {IdClient}", idClient);
                return newPolicy;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en en Handler-AddPolizaPorClienteIdAsync", idClient);
                throw;
            }

        }
        public async Task DeletePolizaClienteIdAsync(int idPolicy)
        {
            try
            {
                _logger.LogInformation("Iniciando eliminación de póliza con ID: {IdPolicy}", idPolicy);
                await _polizaRepo.DeletePolizaClienteIdAsync(idPolicy);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en el Handler-DeletePolizaClienteIdAsync", idPolicy);
                throw;
            }

        }
        public async Task UpdatePolizaPorClienteAsync(Policy policy, int id)
        {
            try
            {
                _logger.LogInformation("Iniciando actualización de póliza con ID: {Id}", id);
                await _polizaRepo.UpdatePolizaPorClienteAsync(policy, id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en el Handler-UpdatePolizaPorClienteAsync", id);
                throw;
            }

        }

    }
}
