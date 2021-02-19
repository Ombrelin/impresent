using System;

namespace Impresent.Web.Model.Dtos
{
    public class CreateStudentDto
    {
        public string FullName { get; set; }
        public DateTime? LastPresence { get; set; }
    }
}