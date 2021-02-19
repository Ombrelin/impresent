using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Impresent.Web.Database;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Impresent.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IPromotionRepository repository;
        private readonly IConfiguration configuration;

        public AuthController(IPromotionRepository repository)
        {
            this.repository = repository;
        }

        [HttpPost]
        public async Task<ActionResult<TokenDto>> Login([FromBody] AuthDto dto)
        {
            Promotion promo = null;
            try
            {
                promo = await repository.GetByName(dto.PromotionName);
            }
            catch (Exception e) when (e is ArgumentException)
            {
                return BadRequest(e.Message);
            }
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, promo.Password))
            {
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET"));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, promo.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenString = tokenHandler.WriteToken(token);

            return new TokenDto() {Token = tokenString};
        }
    }
}