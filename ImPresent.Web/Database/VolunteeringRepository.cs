using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Impresent.Web.Database
{
    public class VolunteeringRepository : IVolunteeringRepository
    {
        private readonly DbSet<Volunteering> volunteersDb;
        private readonly ApplicationDbContext dbContext;
        private readonly IPromotionRepository promotionRepository;

        public VolunteeringRepository(ApplicationDbContext dbContext, IPromotionRepository promotionRepository)
        {
            this.dbContext = dbContext;
            this.promotionRepository = promotionRepository;
            volunteersDb = dbContext.Set<Volunteering>();
        }


        public async Task<Volunteering> Insert(Volunteering v)
        {
            await volunteersDb.AddAsync(v);
            await dbContext.SaveChangesAsync();

            return v;
        }

        public async Task<List<Volunteering>> GetFromPromoAndDay(Guid promoId, Guid dayId)
        {
            var studentsIds =
                (await promotionRepository.GetByIdWithStudents(promoId)).Students.Select(p => p.Id);
            return volunteersDb.Include(v => v.Student).Include(v => v.PresenceDay).Where(v => studentsIds.Contains(v.Student.Id) && v.PresenceDay.Id == dayId).ToList();
        }

        public async Task DeleteById(Guid id)
        {
            var volunteering = await volunteersDb.FindAsync(id);
            volunteersDb.Remove(volunteering);
            await dbContext.SaveChangesAsync();
        }

        public async Task<bool> ExistsForPromotionAndDay(Guid promoId, Guid dayId, Guid volunteeringId)
        {
            try
            {
                var promo = await promotionRepository.GetByIdWithDays(promoId);
                var presenceDay = promo
                    .PresenceDays
                    .First(day => day.Id == dayId);

                var volunteering = await this.volunteersDb
                    .Include(v => v.PresenceDay)
                    .FirstAsync(v => v.Id == volunteeringId);

                return volunteering.PresenceDay.Id == dayId;
            }
            catch (Exception e) when (e is ArgumentException or InvalidOperationException)
            {
                return false;
            }

        }
    }
}