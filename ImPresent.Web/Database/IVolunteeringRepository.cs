using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Impresent.Web.Model;

namespace Impresent.Web.Database
{
    public interface IVolunteeringRepository
    {
        Task<Volunteering> Insert(Volunteering v);
        Task<List<Volunteering>> GetFromPromoAndDay(Guid promoId, Guid dayId);
        Task DeleteById(Guid id);
        Task<bool> ExistsForPromotionAndDay(Guid promoId, Guid dayId, Guid volunteeringId);
    }
}