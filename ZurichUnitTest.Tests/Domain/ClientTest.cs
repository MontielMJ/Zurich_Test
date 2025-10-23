using Domain.Entities;
using Domain.Enums;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.ValueObjects;

namespace ZurichUnitTest.Tests.Domain
{
    public class ClientTest
    {
        [Fact]
        public void CreaPoliza_DeberiaTenerFechasCorrectas()
        {
            var fechaInit = DateTime.Now.AddDays(-1);
            var fechaEnd = DateTime.Now.AddYears(1);

            var poliza = new Policy(folio: new PolicyNumber(1), type: TypePolicy.Auto, initDate: fechaInit, endDate: fechaEnd, insuredAmount: 20000, status: false);
        }

        [Fact]
        public void CrearCliente_DeberiaTenerNombreCorrecto()
        {
            var cliente = new Client(fullname: "José Gómez", email: new Email("jmontiel@gmail.com"), phone: 4561326457, identificationNumber: 1235647891, createAt: DateTime.Now, status: false);
            Assert.Equal("José Gómez", cliente.Fullname);
        }
    }
}
