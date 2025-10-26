using Application.Handler;
using Domain.Entities;
using Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Zurich_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = UserRoles.PolicyClientOrAdmin)]
    public class PolicyController : ControllerBase
    {
        private readonly PolizaHandler _polizaHandler;
        private readonly ILogger<PolicyController> _logger;

        public PolicyController(PolizaHandler polizaHandler, ILogger<PolicyController> logger)
        {
            this._polizaHandler = polizaHandler;
            _logger = logger;
        }
        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            _logger.LogInformation("Obteniendo la lista de pólizas");
            var polizas = await _polizaHandler.ObtenerPolizasAsync();
            _logger.LogInformation("Lista de pólizas obtenida exitosamente");
            return Ok(polizas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Obteniendo la póliza con ID: {Id}", id);
            var polizas = await _polizaHandler.ObtenerPolizasPorPolizaIdAsync(id);
            _logger.LogInformation("Póliza con ID: {Id} obtenida exitosamente", id);
            return Ok(polizas);
        }
       
        [HttpPost("{idClient}")]
        public async Task<IActionResult> Post([FromBody] Policy policy, int idClient)
        {
            _logger.LogInformation("Agregando una nueva póliza para el cliente con ID: {IdClient}", idClient);
            var newPolicy = await _polizaHandler.AddPolizaPorClienteIdAsync(policy, idClient);
            _logger.LogInformation("Nueva póliza agregada exitosamente con ID: {Id}", newPolicy.Id);
            return Ok(policy);
        }
        [HttpDelete("{idPolicy}")]
        public async Task<IActionResult> Delete(int idPolicy)
        {
            _logger.LogInformation("Eliminando la póliza con ID: {IdPolicy}", idPolicy);
            await _polizaHandler.DeletePolizaClienteIdAsync(idPolicy);
            _logger.LogInformation("Póliza con ID: {IdPolicy} eliminada exitosamente", idPolicy);
            return Ok();
        }
        [HttpPut("{idPolicy}")]
        public async Task<IActionResult> Put([FromBody] Policy policy, int idPolicy)
        {
            _logger.LogInformation("Actualizando la póliza con ID: {IdPolicy}", idPolicy);
            await _polizaHandler.UpdatePolizaPorClienteAsync(policy, idPolicy);
            _logger.LogInformation("Póliza con ID: {IdPolicy} actualizada exitosamente", idPolicy);
            return Ok();
        }

        [HttpGet("ByClient/{idClient}")]
        public async Task<IActionResult> GetPoliciesByClientId(int idClient)
        {
            _logger.LogInformation("Obteniendo las pólizas para el cliente con ID: {IdClient}", idClient);
            var polizas = await _polizaHandler.ObtenerPolizasPorClienteIdAsync(idClient);
            _logger.LogInformation("Pólizas para el cliente con ID: {IdClient} obtenidas exitosamente", idClient);
            return Ok(polizas);
        }

    }
}
