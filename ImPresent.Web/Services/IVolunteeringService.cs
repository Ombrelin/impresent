using System;
using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;

namespace Impresent.Web.Services
{
    public interface IVolunteeringService
    {
        Task<VolunteeringDto> Volunteer(Guid promoId, Guid dayId, CreateVolunteeringDto dto);
    }
}