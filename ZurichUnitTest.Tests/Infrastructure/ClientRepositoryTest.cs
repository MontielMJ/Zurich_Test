using Domain.Entities;
using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Infrastructure.Repositories;


namespace ZurichUnitTest.Tests.Infrastructure
{
    public class ClientRepositoryTest
    {
        [Fact]
        public async Task ObtenerTodosAsync_DeberiaRetornarClientesDesdeDb()
        {
            var options = new DbContextOptionsBuilder<ZurichDbContext>()
                .UseInMemoryDatabase(databaseName: "ZurichTestDb")
                .Options;

            using (var context = new ZurichDbContext(options))
            {

                var cliente = new Client(fullname: "José Gómez", email: new Email("jmontiel@gmail.com"), phone: 4561326457, identificationNumber: 1235647891, createAt: DateTime.Now, status: false);

                context.Clients.Add(cliente);
                await context.SaveChangesAsync();
            }

            using (var context = new ZurichDbContext(options))
            {
                var repo = new ClientRepository(context);
                var clientes = await repo.ObtenerClientesAsync();

                Assert.Single(clientes);
                Assert.Equal("José Gómez", clientes.First().Fullname);
            }
        }
    }
}
