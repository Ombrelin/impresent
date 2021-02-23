using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;

namespace Impresent.Web.Database
{
    public interface IVolunteeringRepository
    {
        Task<Volunteering> Insert(Volunteering v);
        Task<List<Volunteering>> GetFromPromoAndDay(Guid promoId, Guid dayId);
    }
}