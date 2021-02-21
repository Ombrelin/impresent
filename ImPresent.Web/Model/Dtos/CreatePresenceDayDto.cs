using System;
using System.ComponentModel.DataAnnotations;

namespace Impresent.Web.Model.Dtos
{
    public class CreatePresenceDayDto
    {
        [Required] public DateTime Date { get; set; }
    }
}