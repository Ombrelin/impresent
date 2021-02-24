using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Impresent.Web.Database;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;

namespace Impresent.Web.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository repository;

        public PromotionService(IPromotionRepository repository)
        {
            this.repository = repository;
        }

        public async Task<PromotionDto> CreatePromotion(CreatePromotionDto dto)
        {
            var passwordValidity = ValidatePassword(dto.Password);
            var isPasswordValid = passwordValidity == "Valid";
            if (!isPasswordValid)
            {
                throw new ArgumentException(passwordValidity);
            }

            var promo = new Promotion()
            {
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                ClassName = dto.Name
            };

            promo = await repository.Insert(promo);

            return new PromotionDto()
            {
                Id = promo.Id,
                ClassName = promo.ClassName
            };
        }

        public async Task<StudentDto> AddStudentToPromotion(Guid promotionId, CreateStudentDto dto)
        {
            var promo = await repository.GetByIdWithStudents(promotionId);
            var student = new Student()
            {
                FullName = dto.FullName,
                LastPresence = dto.LastPresence ?? new DateTime(1970, 1, 1)
            };

            promo.Students.Add(student);

            promo = await repository.Update(promo);
            return MapStudentToDto(student);
        }

        public async Task<PresenceDayDto> AddPresenceDay(Guid id, CreatePresenceDayDto dto)
        {
            var promo = await repository.GetByIdWithDays(id);
            if (dto.Date <= DateTime.Today)
            {
                throw new ArgumentException($"Can't add a past date : {dto.Date}");
            }

            var presenceDay = new PresenceDay()
            {
                Date = dto.Date
            };

            promo.PresenceDays.Add(presenceDay);
            await repository.Update(promo);

            return new PresenceDayDto()
            {
                Id = presenceDay.Id,
                Date = presenceDay.Date
            };
        }

        public async Task<List<StudentDto>> GetDesignated(Guid promoId, int number)
        {
            var designated = await repository.GetDesignated(promoId, number);
            return designated.Select(MapStudentToDto).ToList();
        }


        public async Task<PromotionFullDto> GetPromotion(Guid promotionId)
        {
            var promo = await repository.GetByIdWithDaysAndStudents(promotionId);
            return new PromotionFullDto()
            {
                Id = promo.Id,
                ClassName = promo.ClassName,
                Students = promo.Students.Select(MapStudentToDto).ToList(),
                PresenceDays = promo.PresenceDays.Select(pd => new PresenceDayDto() {Id = pd.Id, Date = pd.Date})
                    .ToList()
            };
        }

        private static StudentDto MapStudentToDto(Student s) => new StudentDto()
                {Id = s.Id, FullName = s.FullName, LastPresence = s.LastPresence};
        


        private string ValidatePassword(string password)
        {
            if (!new Regex(@"(?=.*[a-z])").IsMatch(password))
            {
                return "Invalid Password : At least one lowercase letter is required";
            }

            if (!new Regex(@"(?=.*[A-Z])").IsMatch(password))
            {
                return "Invalid Password : At least one uppercase letter is required";
            }

            if (!new Regex(@"(?=.*\d)").IsMatch(password))
            {
                return "Invalid Password : At least one number is required";
            }

            if (!new Regex(@"^.{8,32}$").IsMatch(password))
            {
                return "Invalid Password : Password length : 8-32 characters";
            }

            return "Valid";
        }
    }
}