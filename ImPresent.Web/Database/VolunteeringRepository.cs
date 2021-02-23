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
    }
}