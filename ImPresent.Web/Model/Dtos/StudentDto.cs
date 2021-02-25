using System;

namespace Impresent.Web.Model.Dtos
{
    public class StudentDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public DateTime LastPresence { get; set; }

        public StudentDto()
        {
        }

        public StudentDto(Guid id, string fullName, DateTime lastPresence)
        {
            Id = id;
            FullName = fullName;
            LastPresence = lastPresence;
        }

        public StudentDto(Student s)
        {
            this.Id = s.Id;
            this.FullName = s.FullName;
            this.LastPresence = s.LastPresence;
        }
    }
}