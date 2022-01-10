using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Backend.Services;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Function.Startup))]
namespace Function {
    public class Startup : FunctionsStartup {
        public override void Configure(IFunctionsHostBuilder builder) 
        {
            builder.Services.AddHttpClient();
            builder.Services.AddScoped<ICurrencyExchangerService, CurrencyExchangerService>();
        }
    }
}