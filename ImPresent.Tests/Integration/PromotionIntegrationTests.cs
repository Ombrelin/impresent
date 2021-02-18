﻿using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Impresent.Web.Database;
using Impresent.Web.Model.Dtos;
using Xunit;

namespace ImPresent.Tests.Integration
{
    public partial class IntegrationTests: IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient client;
        private readonly ApplicationDbContext db;
        
        public IntegrationTests(CustomWebApplicationFactory factory)
        {
            this.client = factory.CreateClient();
            this.db = factory.Context;
            factory.Context.Database.EnsureDeleted();
            
        }
   
        [Fact]
        public async Task CreatePromotion()
        {
            var registerDto = new CreatePromotionDto()
            {
                Name = "M1 APP LSI 1",
                Password = "Lahlou<3"
            };
            var registerResponse = await client.PostAsJsonAsync("api/promotions", registerDto);
            Assert.True(registerResponse.IsSuccessStatusCode);
            var result = await registerResponse.Content.ReadAsAsync<PromotionDto>();
            
            
            Assert.Equal("M1 APP LSI 1", result.ClassName);
            Assert.NotNull(result.Id);

            Assert.Single(db.Promotions.ToList());
            var promo = await db.Promotions.FindAsync(result.Id);
            Assert.NotNull(promo);
            Assert.Equal("M1 APP LSI 1", promo.ClassName);
        }
    }
}