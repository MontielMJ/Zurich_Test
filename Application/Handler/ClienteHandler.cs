using Domain.Interfaces;
using Domain.Entities;
using Domain.ValueObjects;
using Microsoft.Extensions.Logging;


namespace Application.Handler
{
    public class ClienteHandler
    {
        private readonly IClientRepository _clienteRepo;
        private readonly ILogger<ClienteHandler> _logger;
        public ClienteHandler(IClientRepository clienteRepo, ILogger<ClienteHandler> logger)
        {
            _clienteRepo = clienteRepo;
            _logger = logger;
        }

        public async Task<List<Client>> GetClientsAsync()
        {
            var cliente = new List<Client>();
            try
            {
                _logger.LogInformation("Iniciando el Handler-GetClientsAsync");
                cliente = await _clienteRepo.ObtenerClientesAsync();
            }
            catch (Exception)
            {
                _logger.LogError("Error en el Handler-GetClientsAsync");
            }


            return cliente;
        }
        public async Task<Client> GetClientByIdAsync(int id)
        {
            var cliente = new Client();
            try
            {
                cliente = await _clienteRepo.ObtenerClientePorIdAsync(id);
            }
            catch (Exception)
            {
                _logger.LogError("Error en el Handler-GetClientByIdAsync");
            }
            return cliente;
        }
        public async Task<Client> AddClientAsync(Client client)
        {
            var createdClient = new Client();
            try
            {
                createdClient = await _clienteRepo.AddClientAsync(client);
            }
            catch (Exception)
            {
                _logger.LogError("Error en el Handler-AddClientAsync");
            }
            return createdClient;
        }
        public async Task DeleteClientAsync(int id)
        {
            try
            {
                await _clienteRepo.DeleteClientAsync(id);
            }
            catch (Exception)
            {

                _logger.LogError("Error en el Handler-DeleteClientAsync");
            }
        }
        public async Task UpdateClientAsync(Client client)
        {
            try
            {
                await _clienteRepo.UpdateClientAsync(client);
            }
            catch (Exception)
            {
               _logger.LogError("Error en el Handler-UpdateClientAsync");
            }
        }

    }
}
