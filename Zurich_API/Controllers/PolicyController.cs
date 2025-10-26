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
        public PolicyController(PolizaHandler polizaHandler)
        {
            this._polizaHandler = polizaHandler;
        }
        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var polizas = await _polizaHandler.ObtenerPolizasAsync();
            return Ok(polizas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var polizas = await _polizaHandler.ObtenerPolizasPorPolizaIdAsync(id);
            return Ok(polizas);
        }
       
        [HttpPost("{idClient}")]
        public async Task<IActionResult> Post([FromBody] Policy policy, int idClient)
        {
            var newPolicy = await _polizaHandler.AddPolizaPorClienteIdAsync(policy, idClient);
            return Ok(policy);
        }
        [HttpDelete("{idPolicy}")]
        public async Task<IActionResult> Delete(int idPolicy)
        {
            await _polizaHandler.DeletePolizaClienteIdAsync(idPolicy);
            return Ok();
        }
        [HttpPut("{idPolicy}")]
        public async Task<IActionResult> Put([FromBody] Policy policy, int idPolicy)
        {
            await _polizaHandler.UpdatePolizaPorClienteAsync(policy, idPolicy);
            return Ok();
        }

        [HttpGet("ByClient/{idClient}")]
        public async Task<IActionResult> GetPoliciesByClientId(int idClient)
        {
            var polizas = await _polizaHandler.ObtenerPolizasPorClienteIdAsync(idClient);
            return Ok(polizas);
        }

    }
}
