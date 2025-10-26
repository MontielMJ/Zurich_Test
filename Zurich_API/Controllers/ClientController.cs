using Application.Handler;
using Domain.Entities;
using Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Zurich_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class ClientController : ControllerBase
    {
        private readonly ClienteHandler _registrarClienteHandler;
        private readonly PolizaHandler _polizaHandler;
        public ClientController(ClienteHandler registrarClienteHandler, PolizaHandler polizaHandler)
        {
            this._registrarClienteHandler = registrarClienteHandler;
            _polizaHandler = polizaHandler;
        }

        [HttpGet]
     
        public async Task<IActionResult> Get()
        {
            var clientes = await _registrarClienteHandler.GetClientsAsync();
            return Ok(clientes);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cliente = await _registrarClienteHandler.GetClientByIdAsync(id);
            return Ok(cliente);
        }
        [HttpPost]
        public async Task<ActionResult<Client>> Post([FromBody] Client client)
        {
            var newClient = await _registrarClienteHandler.AddClientAsync(client);
            return CreatedAtAction(nameof(Get), new { id=newClient.Id });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _registrarClienteHandler.DeleteClientAsync(id);
            return Ok();
        }
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Client client)
        {
            await _registrarClienteHandler.UpdateClientAsync(client);
            return Ok();
        }
    }
}
