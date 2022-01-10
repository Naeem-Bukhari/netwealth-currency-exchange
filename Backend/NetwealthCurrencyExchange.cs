using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using Backend.Services;

namespace Function
{
    public class NetwealthCurrencyExchange
    {
        private readonly ICurrencyExchangerService _currencyExchangerService;
        
        public NetwealthCurrencyExchange(ICurrencyExchangerService currencyExchangerService){
            _currencyExchangerService = currencyExchangerService;
        }

        [FunctionName("NetwealthCurrencyExchange")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequestMessage req,
            ILogger log)
        {
             log.LogInformation("C# HTTP trigger function processed a request.");

            var exchange = await req.Content.ReadAsAsync<ExchangeRequest>();
            var exchanged = await _currencyExchangerService.ApplyExchange(exchange);

            log.LogInformation("C# HTTP trigger function completed currency exchange!", exchanged);

            return new OkObjectResult(exchanged);
        }
    }

    public class ExchangeRequest
    {
        public string SourceCurrency { get; set; }
        public string DestinationCurrency { get; set; }
        public double AmountToConvert { get; set; }
    }

    public class ExchangeResponse
    {
        public string SourceCurrency { get; set; }
        public string DestinationCurrency { get; set; }
        public double AmountToConvert { get; set; }
        public double ConvertedAmount { get; set; }
    }
}
