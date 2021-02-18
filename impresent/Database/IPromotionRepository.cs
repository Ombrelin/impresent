using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using impresent.Model;

namespace impresent.Database
{
    public interface IPromotionRepository
    {
        Task<Promotion> Insert(Promotion p);
        Task<Promotion> GetByIdWithStudents(Guid promotionId);
        Task<Promotion> GetById(Guid promotionId);
        Task<Promotion> Update(Promotion p);
    }
}