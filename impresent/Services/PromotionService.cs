using System;
using System.Text.RegularExpressions;
using impresent.Database;
using impresent.Model;
using impresent.Model.Dtos;

namespace impresent.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository repository;

        public PromotionService(IPromotionRepository repository)
        {
            this.repository = repository;
        }

        public PromotionDto CreatePromotion(CreatePromotionDto dto)
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
            }
        }

        public StudentDto AddStudentToPromotion(Guid promotionId, CreateStudentDto dto)
        {
            throw new NotImplementedException();
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