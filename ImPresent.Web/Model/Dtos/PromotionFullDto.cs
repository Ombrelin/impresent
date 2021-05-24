using System;
using System.Collections.Generic;
using System.Linq;

namespace Impresent.Web.Model.Dtos
{
    public class PromotionFullDto
    {
        public Guid Id { get; set; }
        public string ClassName { get; set; }
        public ICollection<StudentDto> Students { get; set; }
        public ICollection<PresenceDayDto> PresenceDays { get; set; }

        public PromotionFullDto(Promotion promo)
        {
            Id = promo.Id;
            ClassName = promo.ClassName;
            Students = promo.Students.Select(s => new StudentDto(s)).ToList();
            PresenceDays = promo.PresenceDays
                .Select(pd => new PresenceDayDto(pd))
                .ToList();
        }

        public PromotionFullDto()
        {
        }
    }
}