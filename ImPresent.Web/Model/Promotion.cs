using System;
using System.Collections;
using System.Collections.Generic;

namespace Impresent.Web.Model
{
    public class Promotion
    {
        public Guid Id { get; set; }
        public string ClassName { get; set; }
        public string Password { get; set; }
        public ICollection<Student> Students { get; set; }
        public ICollection<PresenceDay> PresenceDays { get; set; }
    }
}