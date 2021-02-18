using System;
using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;

namespace Impresent.Web.Services
{
    public interface IPromotionService
    {
        Task<PromotionDto> CreatePromotion(CreatePromotionDto dto);
        Task<StudentDto> AddStudentToPromotion(Guid promotionId, CreateStudentDto dto);
        Task<PromotionFullDto> GetPromotion(Guid promotionId);
    }
}