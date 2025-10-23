using Domain.Interfaces;
using Domain.Entities;
using Domain.ValueObjects;


namespace Application.Handler
{
    public class ClienteHandler
    {
        private readonly IClientRepository _clienteRepo;
        public ClienteHandler(IClientRepository clienteRepo)
        {
            _clienteRepo = clienteRepo;
        }

        public async Task<List<Client>> GetClientsAsync()
        {
            var cliente = await _clienteRepo.ObtenerClientesAsync();
            if (cliente == null)
            {
                throw new Exception("Clientes no encontrado");
            }
            return cliente;
        }
        public async Task<Client> GetClientByIdAsync(int id)
        {
            var cliente = await _clienteRepo.ObtenerClientePorIdAsync(id);
            if (cliente == null)
            {
                throw new Exception("Cliente no encontrado");
            }
            return cliente;
        }
        public async Task<Client> AddClientAsync(Client client)
        {
           return await _clienteRepo.AddClientAsync(client);
        }
        public async Task DeleteClientAsync(int id)
        {
            await _clienteRepo.DeleteClientAsync(id);
        }
        public async Task UpdateClientAsync(Client client)
        {
            await _clienteRepo.UpdateClientAsync(client);
        }

    }
}
