using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Impresent.Web.Database;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;

namespace Impresent.Web.Services
{
    public class VolunteeringService : IVolunteeringService
    {
        private readonly IVolunteeringRepository volunteeringRepository;
        private readonly IPromotionRepository promotionRepository;

        public VolunteeringService(IVolunteeringRepository volunteeringRepository,
            IPromotionRepository promotionRepository)
        {
            this.volunteeringRepository = volunteeringRepository;
            this.promotionRepository = promotionRepository;
        }

        public async Task<VolunteeringDto> Volunteer(Guid promoId, Guid dayId, CreateVolunteeringDto dto)
        {
            var promo = await promotionRepository.GetByIdWithDaysAndStudents(promoId);
            var day = promo.PresenceDays.First(d => d.Id == dayId);
            var student = promo.Students.First(s => s.Id == dto.StudentId);

            var volunteering = new Volunteering() {Student = student, PresenceDay = day};
            await volunteeringRepository.Insert(volunteering);

            return new VolunteeringDto()
            {
                Id = volunteering.Id,
                Student = new StudentDto(volunteering.Student),
                PresenceDay = new PresenceDayDto(volunteering.PresenceDay)
            };
        }

        public async Task<VolunteeringsDto> GetsVolunteers(Guid promoId, Guid dayId)
        {
            var volunteerings = await this.volunteeringRepository.GetFromPromoAndDay(promoId, dayId);
            var promo = await promotionRepository.GetByIdWithDays(promoId);
            return new VolunteeringsDto()
            {
                PresenceDay = new PresenceDayDto(promo.PresenceDays.First(d => d.Id == dayId)),
                Students = volunteerings.Select(v => new StudentDto(v.Student)).ToList()
            };
        }

        public async Task Unvolunteer(Guid promoId, Guid dayId, Guid volunteeringId)
        {
            if (await volunteeringRepository.ExistsForPromotionAndDay(promoId, dayId, volunteeringId))
            {
                await volunteeringRepository.DeleteById(volunteeringId);
            }
            else
            {
                throw new ArgumentException("No such volunteering");
            }
        }
    }
}