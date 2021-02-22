using System;

namespace Impresent.Web.Model.Dtos
{
    public class VolunteeringDto
    {
        public PresenceDayDto PresenceDay { get; set; }
        public StudentDto Student { get; set; }
        public Guid Id { get; set; }
    }
}