﻿using System;
using System.Collections.Generic;

namespace impresent.Model
{
    public class Promotion
    {
        public Guid Id { get; set; }
        public string ClassName { get; set; }
        public string Password { get; set; }
        public ICollection<Student> Students { get; set; }
    }
}