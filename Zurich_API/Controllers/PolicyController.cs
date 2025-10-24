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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var polizas = await _polizaHandler.ObtenerPolizasPorClienteIdAsync(id);
            return Ok(polizas);
        }
        [HttpPost("{idClient}")]
        public async Task<IActionResult> Post([FromBody] Policy policy, int idClient)
        {
            var newPolicy = await _polizaHandler.AddPolizaPorClienteIdAsync(policy, idClient);
            return CreatedAtAction(nameof(GetById), new { id = newPolicy.Id });
        }
        [HttpDelete("{idPolicy}/{idClient}")]
        public async Task<IActionResult> Delete(int idPolicy, int idClient)
        {
            await _polizaHandler.DeletePolizaClienteIdAsync(idPolicy, idClient);
            return Ok();
        }
        [HttpPut("{idClient}")]
        public async Task<IActionResult> Put([FromBody] Policy policy, int idClient)
        {
            await _polizaHandler.UpdatePolizaPorClienteAsync(policy, idClient);
            return Ok();
        }

    }
}
