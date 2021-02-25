using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Impresent.Web.Database
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly DbSet<Promotion> promotionsDb;
        private readonly DbSet<Volunteering> volunteeringsDb;
        private readonly ApplicationDbContext dbContext;

        public PromotionRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
            this.volunteeringsDb = volunteeringsDb;
            promotionsDb = dbContext.Set<Promotion>();
            volunteeringsDb = dbContext.Set<Volunteering>();
        }


        public async Task<Promotion> Insert(Promotion p)
        {
            await promotionsDb.AddAsync(p);
            await dbContext.SaveChangesAsync();

            return p;
        }


        public async Task<Promotion> GetById(Guid promotionId)
        {
            var promo = await promotionsDb.FindAsync(promotionId);

            if (promo == null)
            {
                throw new ArgumentException($"No promotion with id {promotionId}");
            }

            return promo;
        }

        public async Task<Promotion> GetByIdWithStudents(Guid promotionId)
        {
            var promo = await promotionsDb
                .Include(p => p.Students)
                .FirstAsync(p => p.Id == promotionId);

            if (promo == null)
            {
                throw new ArgumentException($"No promotion with id {promotionId}");
            }

            return promo;
        }

        public async Task<Promotion> GetByIdWithDays(Guid promotionId)
        {
            var promo = await promotionsDb
                .Include(p => p.PresenceDays)
                .FirstAsync(p => p.Id == promotionId);

            if (promo == null)
            {
                throw new ArgumentException($"No promotion with id {promotionId}");
            }

            return promo;
        }

        public async Task<Promotion> GetByIdWithDaysAndStudents(Guid promotionId)
        {
            try
            {
                var promo = await promotionsDb
                    .Include(p => p.PresenceDays)
                    .Include(p => p.Students)
                    .FirstAsync(p => p.Id == promotionId);
                return promo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw new ArgumentException($"No promotion with id : {promotionId}");
            }
        }

        public async Task<Promotion> Update(Promotion p)
        {
            promotionsDb.Update(p);
            await dbContext.SaveChangesAsync();
            return p;
        }

        public async Task<Promotion> GetByName(string name)
        {
            try
            {
                return await promotionsDb.FirstAsync(p => p.ClassName == name);
            }
            catch (Exception e) when (e is InvalidOperationException)
            {
                throw new ArgumentException($"No promotion with name : {name}");
            }
        }

        public async Task<List<Student>> GetDesignated(Guid promoId, Guid dayId, int number)
        {
            var promo = await GetByIdWithStudents(promoId);
            return promo.Students
                .Where(s => !volunteeringsDb
                    .Where(v => v.PresenceDay.Id == dayId)
                    .Select(v => v.Student.Id)
                    .Contains(s.Id))
                .OrderBy(s => s.LastPresence)
                .Take(number)
                .ToList();
        }
    }
}