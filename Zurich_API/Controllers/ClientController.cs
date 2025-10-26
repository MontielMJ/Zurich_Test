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
        private readonly ILogger<ClientController> _logger;
        public ClientController(ClienteHandler registrarClienteHandler, ILogger<ClientController> logger )
        {
            this._registrarClienteHandler = registrarClienteHandler;
             this._logger = logger;
        }

        [HttpGet]
     
        public async Task<IActionResult> Get()
        {
            _logger.LogInformation("Obteniendo la lista de clientes");
            var clientes = await _registrarClienteHandler.GetClientsAsync();
            _logger.LogInformation("Lista de clientes obtenida exitosamente");
            return Ok(clientes);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Obteniendo el cliente con ID: {Id}", id);
            var cliente = await _registrarClienteHandler.GetClientByIdAsync(id);
            _logger.LogInformation("Cliente con ID: {Id} obtenido exitosamente", id);
            return Ok(cliente);
        }
        [HttpPost]
        public async Task<ActionResult<Client>> Post([FromBody] Client client)
        {
            _logger.LogInformation("Agregando un nuevo cliente");
            var newClient = await _registrarClienteHandler.AddClientAsync(client);
            _logger.LogInformation("Nuevo cliente agregado exitosamente con ID: {Id}", newClient.Id);
            return CreatedAtAction(nameof(Get), new { id=newClient.Id });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Eliminando el cliente con ID: {Id}", id);
            await _registrarClienteHandler.DeleteClientAsync(id);
            _logger.LogInformation("Cliente con ID: {Id} eliminado exitosamente", id);
            return Ok();
        }
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Client client)
        {
            _logger.LogInformation("Actualizando el cliente con ID: {Id}", client.Id);
            await _registrarClienteHandler.UpdateClientAsync(client);
            _logger.LogInformation("Cliente con ID: {Id} actualizado exitosamente", client.Id);
            return Ok();
        }
    }
}
