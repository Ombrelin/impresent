using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Impresent.Web.Model.Dtos;
using Impresent.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Impresent.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionsController : ControllerBase
    {
        private readonly IPromotionService promotionService;
        private readonly IVolunteeringService volunteeringService;

        public PromotionsController(IPromotionService promotionService, IVolunteeringService volunteeringService)
        {
            this.promotionService = promotionService;
            this.volunteeringService = volunteeringService;
        }

        [HttpPost]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] CreatePromotionDto dto)
        {
            try
            {
                return await promotionService.CreatePromotion(dto);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
        }


        [Authorize]
        [HttpPost("{id:Guid}/students")]
        public async Task<ActionResult<StudentDto>> AddStudentToPromotion(Guid id, [FromBody] CreateStudentDto dto)
        {
            try
            {
                return await promotionService.AddStudentToPromotion(id, dto);
            }
            catch (Exception e) when (e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<PromotionFullDto>> GetPromotion(Guid id)
        {
            try
            {
                return await promotionService.GetPromotion(id);
            }
            catch (Exception e) when (e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
        }

        [Authorize]
        [HttpPost("{id:Guid}/days")]
        public async Task<ActionResult<PresenceDayDto>> AddPresenceDay(Guid id, [FromBody] CreatePresenceDayDto dto)
        {
            try
            {
                return await promotionService.AddPresenceDay(id, dto);
            }
            catch (Exception e) when (e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("{promoId:Guid}/days/{dayId:Guid}/volunteers")]
        public async Task<ActionResult<VolunteeringDto>> Volunteer(Guid promoId, Guid dayId,
            [FromBody] CreateVolunteeringDto dto)
        {
            try
            {
                return await volunteeringService.Volunteer(promoId, dayId, dto);
            }
            catch (Exception e) when (e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{promoId:Guid}/days/{dayId:Guid}/volunteers")]
        public async Task<ActionResult<List<VolunteeringDto>>> Volunteer(Guid promoId, Guid dayId)
        {
            try
            {
                return await volunteeringService.GetsVolunteers(promoId, dayId);
            }
            catch (Exception e) when (e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
        }
    }
}