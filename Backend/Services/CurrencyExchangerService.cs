using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Function;
using Newtonsoft.Json.Linq;

namespace Backend.Services
{
    public class CurrencyExchangerService : ICurrencyExchangerService
    {
        private readonly HttpClient _client;

        public CurrencyExchangerService(IHttpClientFactory httpClientFactory) {
            _client = httpClientFactory.CreateClient();
        }

        public async Task<ExchangeResponse> ApplyExchange(ExchangeRequest exchange)
        {
            var httpRequestMessage = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/{exchange.SourceCurrency.ToLower()}/{exchange.DestinationCurrency.ToLower()}.json?ref=https://githubhelp.com"
            );

            var httpResponseMessage = await _client.SendAsync(httpRequestMessage);
            httpResponseMessage.EnsureSuccessStatusCode();
            var responseObject = await httpResponseMessage.Content.ReadAsAsync<JToken>();
            var exchangeRate = responseObject.Last.First.Value<double>();
            var convertedAmount = exchange.AmountToConvert * exchangeRate;
            
            return new ExchangeResponse 
            {
                SourceCurrency = exchange.SourceCurrency,
                DestinationCurrency = exchange.DestinationCurrency,
                AmountToConvert = exchange.AmountToConvert,
                ConvertedAmount = convertedAmount
            };
        }
    }
}