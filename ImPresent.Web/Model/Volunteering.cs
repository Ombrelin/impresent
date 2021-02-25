using System;

namespace Impresent.Web.Model
{
    public class Volunteering
    {
        public Guid Id { get; set; }
        public Student Student { get; set; }
        public PresenceDay PresenceDay { get; set; }
    }
}