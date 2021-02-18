using System;
using System.Linq;
using System.Threading.Tasks;
using Impresent.Web.Model;
using Microsoft.EntityFrameworkCore;

namespace Impresent.Web.Database
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

        public async Task<Promotion> GetById(Guid promotionId)
        {
            var promo = await PromotionsDb.FindAsync(promotionId);

            if (promo == null)
            {
                throw new ArgumentException($"No promotion with id {promotionId}");
            }

            return promo;
        }

        public async Task<Promotion> GetByIdWithStudents(Guid promotionId)
        {
            var promo = PromotionsDb
                .Include(p=> p.Students)
                .First(p => p.Id == promotionId);

            if (promo == null)
            {
                throw new ArgumentException($"No promotion with id {promotionId}");
            }
            
            return promo;
        }

        public async Task<Promotion> Update(Promotion p)
        {
            PromotionsDb.Update(p);
            await DbContext.SaveChangesAsync();
            return p;
        }

        public async Task<Promotion> GetByName(string name)
        {
            var promo = await PromotionsDb.FirstAsync(p => p.ClassName == name);
            
            if (promo == null)
            {
                throw new ArgumentException($"No promotion with name {name}");
            }
            return promo;
        }
    }
}