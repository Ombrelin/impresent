﻿using System;

namespace impresent.Model.Dtos
{
    public class StudentDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public DateTime LastPresence { get; set; }
    }
}