using Application.Handler;
using Domain.Entities;
using Domain.Interfaces;
using Domain.ValueObjects;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZurichUnitTest.Tests.Application
{
    public class ClienteHandlerTests
    {
        [Fact]
        public async Task ObtenerClientes_DeberiaRetornarLista()
        {
            var mockRepo = new Mock<IClientRepository>();
            mockRepo.Setup(r => r.ObtenerClientesAsync())
                .ReturnsAsync(new List<Client> {
                    new Client(fullname: "José Gómez", email: new Email("jmontiel@gmail.com"), phone: 4561326457, identificationNumber: 1235647891, createAt: DateTime.Now, status: false)
                });

            var clientHandler = new ClienteHandler(mockRepo.Object, logger: null);
            var clients = await clientHandler.GetClientsAsync();
            clients.Should().NotBeEmpty();
            clients.First().Fullname.Should().Be("José Gómez");

        }
    }
}
