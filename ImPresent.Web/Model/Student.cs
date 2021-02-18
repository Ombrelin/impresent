using System;

namespace Impresent.Web.Model
{
    public class Student
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public DateTime LastPresence { get; set; }
    }
}