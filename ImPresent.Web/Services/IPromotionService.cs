using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Impresent.Web.Services
{
    public interface IPromotionService
    {
        Task<PromotionDto> CreatePromotion(CreatePromotionDto dto);
        Task<StudentDto> AddStudentToPromotion(Guid promotionId, CreateStudentDto dto);
        Task<PromotionFullDto> GetPromotion(Guid promotionId);
        Task<PresenceDayDto> AddPresenceDay(Guid id, CreatePresenceDayDto dto);
        Task<List<StudentDto>> GetDesignated(Guid promoId, Guid dayId, int number);
        Task ValidateList(Guid promoId, Guid dayId, List<Guid> listIds);
    }
}