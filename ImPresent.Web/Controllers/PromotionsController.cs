using System;
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

        public PromotionsController(IPromotionService promotionService)
        {
            this.promotionService = promotionService;
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
        public Task<StudentDto> AddStudentToPromotion(Guid id, [FromBody] CreateStudentDto dto)
            => promotionService.AddStudentToPromotion(id, dto);
        
        [HttpGet("{id:Guid}")]
        public Task<PromotionFullDto> GetPromotion(Guid id) => promotionService.GetPromotion(id);

        [Authorize]
        [HttpPost("{id:Guid}/days")]
        public Task<PresenceDayDto> AddPresenceDay(Guid id, [FromBody] CreatePresenceDayDto dto)
            => promotionService.AddPresenceDay(id,dto);
    }
}