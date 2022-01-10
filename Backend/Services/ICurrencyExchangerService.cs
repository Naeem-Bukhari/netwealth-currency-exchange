using System.Threading.Tasks;
using Function;

namespace Backend.Services
{
    public interface ICurrencyExchangerService
    {
       Task<ExchangeResponse> ApplyExchange(ExchangeRequest exchange);
    }
}