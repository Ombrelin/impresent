using System;
using System.Linq;
using System.Threading.Tasks;
using impresent.Model;
using Microsoft.EntityFrameworkCore;

namespace impresent.Database
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly DbSet<Promotion> PromotionsDb;
        private readonly ApplicationDbContext DbContext;

        public PromotionRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
            PromotionsDb = dbContext.Set<Promotion>();
        }


        public async Task<Promotion> Insert(Promotion p)
        {
            await PromotionsDb.AddAsync(p);
            await DbContext.SaveChangesAsync();

            return p;
        }

        public Task<Promotion> GetById(Guid promotionId)
        {
            throw new NotImplementedException();
        }

        public async Task<Promotion> GetByIdWithStudents(Guid promotionId)
        {
            return PromotionsDb
                .Include(p=> p.Students)
                .First(p => p.Id == promotionId);
        }

        public async Task<Promotion> Update(Promotion p)
        {
            PromotionsDb.Update(p);
            await DbContext.SaveChangesAsync();
            return p;
        }
    }
}