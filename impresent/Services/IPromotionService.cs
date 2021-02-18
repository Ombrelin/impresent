using System;
using impresent.Model.Dtos;

namespace impresent.Services
{
    public interface IPromotionService
    {
        PromotionDto CreatePromotion(CreatePromotionDto dto);
        StudentDto AddStudentToPromotion(Guid promotionId, CreateStudentDto dto);
    }
}