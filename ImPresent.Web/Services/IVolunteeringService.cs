using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Impresent.Web.Services
{
    public interface IVolunteeringService
    {
        Task<VolunteeringDto> Volunteer(Guid promoId, Guid dayId, CreateVolunteeringDto dto);
        Task<VolunteeringsDto> GetsVolunteers(Guid promoId, Guid dayId);

    }
}