using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Impresent.Web.Database;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;
using Microsoft.AspNetCore.Http;

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
            await repository.Update(promo);
            return new StudentDto(student);
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

            return new PresenceDayDto(presenceDay);
        }

        public async Task<List<StudentDto>> GetDesignated(Guid promoId, Guid dayId, int number)
        {
            var designated = await repository.GetDesignated(promoId, dayId, number);
            return designated
                .Select(s => new StudentDto(s))
                .ToList();
        }

        public async Task ValidateList(Guid promoId, Guid dayId, List<Guid> listIds)
        {
            var promo = await repository.GetByIdWithDaysAndStudents(promoId);
            var date = promo.PresenceDays.First(pd => pd.Id == dayId).Date;


            foreach (var student in promo.Students)
            {
                student.LastPresence = date;
            }

            await repository.Update(promo);
        }

        public async Task<PromotionFullDto> ImportStudents(Guid promoId, IFormFile file)
        {
            using var streamReader = new StreamReader(file.OpenReadStream());
            var studentsNames = (await streamReader.ReadToEndAsync()).Split("\n");
            var students = studentsNames.Select(name => new Student()
            {
                FullName = name.Trim(),
                LastPresence = new DateTime(1970, 1, 1)
            }).ToList();

            var promo = await repository.GetByIdWithDaysAndStudents(promoId);
            foreach (var student in students)
            {
                promo.Students.Add(student);
            }

            await repository.Update(promo);

            return new PromotionFullDto(promo);
        }


        public async Task<PromotionFullDto> GetPromotion(Guid promotionId)
        {
            return new PromotionFullDto(await repository.GetByIdWithDaysAndStudents(promotionId));
        }


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