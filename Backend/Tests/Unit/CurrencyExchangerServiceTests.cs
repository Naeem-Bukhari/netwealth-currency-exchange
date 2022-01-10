using System.Net.Http;
using System.Threading.Tasks;
using Backend.Services;
using Function;
using Moq;
using Xunit;

namespace Backend.Tests.Unit
{
    public class CurrencyExchangerServiceTests
    {
        [Fact]
        public async Task ShouldExchangeCurrencyCorrectly() 
        {
            //arrange
            var exchange = new ExchangeRequest
            {
                SourceCurrency = "GBP",
                DestinationCurrency = "USD",
                AmountToConvert = 1000
            };

            //=====================================
            var http = new Mock<HttpClient>();
            http.Setup(x => x.SendAsync(It.IsAny<HttpRequestMessage>())).ReturnsAsync(new HttpResponseMessage(System.Net.HttpStatusCode.OK));
            //unfinished mocking. Needto mock http client to return the response we expect to get during a successful call
            //========================


            var clientFactory = new Mock<IHttpClientFactory>();
            clientFactory.Setup(x => x.CreateClient()).Returns(http.Object);

            //act
            var service = new CurrencyExchangerService(clientFactory.Object);
            ExchangeResponse result = await service.ApplyExchange(exchange);

            //assert
            Assert.True(result.ConvertedAmount > 0);
        }
    }
}