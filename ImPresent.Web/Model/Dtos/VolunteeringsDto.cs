using System;
using System.Collections.Generic;

namespace Impresent.Web.Model.Dtos
{
    public class VolunteeringsDto
    {
        public PresenceDayDto PresenceDay { get; set; }
        public List<StudentDto> Students { get; set; }
    }
}