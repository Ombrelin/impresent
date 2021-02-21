using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Impresent.Web.Model;

namespace Impresent.Web.Database
{
    public interface IPromotionRepository
    {
        Task<Promotion> Insert(Promotion p);
        Task<Promotion> GetByIdWithStudents(Guid promotionId);
        Task<Promotion> GetByIdWithDays(Guid promotionId);
        Task<Promotion> GetByIdWithDaysAndStudents(Guid promotionId);
        Task<Promotion> GetById(Guid promotionId);
        Task<Promotion> Update(Promotion p);
        Task<Promotion> GetByName(string name);
    }
}