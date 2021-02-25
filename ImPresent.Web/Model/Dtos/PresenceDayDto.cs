using System;

namespace Impresent.Web.Model.Dtos
{
    public class PresenceDayDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }

        public PresenceDayDto()
        {
        }
        
        public PresenceDayDto(PresenceDay day)
        {
            Id = day.Id;
            Date = day.Date;
        }

        public PresenceDayDto(Guid id, DateTime date)
        {
            Id = id;
            Date = date;
        }
    }
}