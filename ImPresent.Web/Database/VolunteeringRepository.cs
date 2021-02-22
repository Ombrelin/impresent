using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Impresent.Web.Database
{
    public class VolunteeringRepository : IVolunteeringRepository
    {
        private readonly DbSet<Volunteering> volunteersDb;
        private readonly ApplicationDbContext dbContext;

        public VolunteeringRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
            volunteersDb = dbContext.Set<Volunteering>();
        }


        public async Task<Volunteering> Insert(Volunteering v)
        {
            await volunteersDb.AddAsync(v);
            await dbContext.SaveChangesAsync();

            return v;
        }
    }
}