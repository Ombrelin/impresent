using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;

namespace Impresent.Web.Database
{
    public interface IVolunteeringRepository
    {
        Task<Volunteering> Insert(Volunteering v);
    }
}