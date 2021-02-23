using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Impresent.Web.Database;
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
                Student = new StudentDto()
                {
                    Id = volunteering.Student.Id,
                    FullName = volunteering.Student.FullName,
                    LastPresence = volunteering.Student.LastPresence
                },
                PresenceDay = new PresenceDayDto()
                {
                    Id = volunteering.PresenceDay.Id,
                    Date = volunteering.PresenceDay.Date
                }
            };
        }

        public async Task<List<VolunteeringDto>> GetsVolunteers(Guid promoId, Guid dayId)
        {
            var volunteerings = await this.volunteeringRepository.GetFromPromoAndDay(promoId, dayId);
            return volunteerings.Select(volunteering => new VolunteeringDto()
            {
                Id = volunteering.Id,
                Student = new StudentDto()
                {
                    Id = volunteering.Student.Id,
                    FullName = volunteering.Student.FullName,
                    LastPresence = volunteering.Student.LastPresence
                },
                PresenceDay = new PresenceDayDto()
                {
                    Id = volunteering.PresenceDay.Id,
                    Date = volunteering.PresenceDay.Date
                }
            }).ToList();
        }
    }
}