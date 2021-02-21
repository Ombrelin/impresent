using System;
using System.Collections.Generic;

namespace Impresent.Web.Model.Dtos
{
    public class PromotionFullDto
    {
        public Guid Id { get; set; }
        public string ClassName { get; set; }
        public ICollection<StudentDto> Students { get; set; }
        public ICollection<PresenceDayDto> PresenceDays { get; set; }
    }
}