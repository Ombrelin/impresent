using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Impresent.Web.Database;
using Impresent.Web.Model;
using Impresent.Web.Model.Dtos;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace ImPresent.Tests.Integration
{
    public partial class IntegrationTests : IClassFixture<CustomWebApplicationFactory>
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
        public async Task<Guid> CreatePromotion()
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
            Assert.NotNull(result.Id.ToString());

            Assert.Single(db.Promotions.ToList());
            var promo = await db.Promotions.FindAsync(result.Id);
            Assert.NotNull(promo);
            Assert.Equal("M1 APP LSI 1", promo.ClassName);

            return result.Id;
        }

        [Fact]
        public async Task<(string, Guid)> Auth()
        {
            // Given
            var promoId = await CreatePromotion();

            var loginDto = new AuthDto()
            {
                PromotionName = "M1 APP LSI 1",
                Password = "Lahlou<3"
            };

            // When
            var loginResponse = await client.PostAsJsonAsync("api/auth", loginDto);

            // Then
            Assert.True(loginResponse.IsSuccessStatusCode);
            var result = await loginResponse.Content.ReadAsAsync<TokenDto>();
            Assert.NotNull(result.Token);
            return (result.Token, promoId);
        }

        [Fact]
        public async Task Auth_PromotionDoesNotExist()
        {
            var loginDto = new AuthDto()
            {
                PromotionName = "M1 APP LSI 1",
                Password = "Lahlou<3"
            };

            // When
            var loginResponse = await client.PostAsJsonAsync("api/auth", loginDto);
            Assert.Equal(HttpStatusCode.BadRequest,loginResponse.StatusCode);
            var body = await loginResponse.Content.ReadAsStringAsync();
            Assert.Equal("No promotion with name : M1 APP LSI 1", body);
        }

        [Fact]
        public async Task AddStudent_WithDate()
        {
            // Given
            var (token, promoId) = await Auth();

            var studentDto = new CreateStudentDto()
            {
                FullName = "Arsène LAPOSTOLET",
                LastPresence = new DateTime(2020, 2, 18)
            };

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
            // When
            var addStudentResponse = await client.PostAsJsonAsync($"api/promotions/{promoId}/students", studentDto);

            // Then
            Assert.True(addStudentResponse.IsSuccessStatusCode);
            var result = await addStudentResponse.Content.ReadAsAsync<StudentDto>();

            Assert.NotNull(result.Id.ToString());
            Assert.Equal("Arsène LAPOSTOLET", result.FullName);
            Assert.Equal(new DateTime(2020, 2, 18), result.LastPresence);

            var promo = db.Promotions
                .Include(p => p.Students)
                .First(p => p.Id == promoId);

            Assert.Single(promo.Students);
            var student = promo.Students.First();
            Assert.NotNull(student.Id.ToString());
            Assert.Equal("Arsène LAPOSTOLET", student.FullName);
            Assert.Equal(new DateTime(2020, 2, 18), student.LastPresence);
        }

        [Fact]
        public async Task AddStudent_WithoutDate_DateIs1stJan1970()
        {
            // Given
            var (token, promoId) = await Auth();

            var studentDto = new CreateStudentDto()
            {
                FullName = "Arsène LAPOSTOLET"
            };

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
            // When
            var addStudentResponse = await client.PostAsJsonAsync($"api/promotions/{promoId}/students", studentDto);

            // Then
            Assert.True(addStudentResponse.IsSuccessStatusCode);
            var result = await addStudentResponse.Content.ReadAsAsync<StudentDto>();

            Assert.NotNull(result.Id.ToString());
            Assert.Equal("Arsène LAPOSTOLET", result.FullName);
            Assert.Equal(new DateTime(1970, 1, 1), result.LastPresence);

            var promo = await db.Promotions
                .Include(p => p.Students)
                .FirstAsync(p => p.Id == promoId);

            Assert.Single(promo.Students);
            var student = promo.Students.First();
            Assert.NotNull(student.Id.ToString());
            Assert.Equal("Arsène LAPOSTOLET", student.FullName);
            Assert.Equal(new DateTime(1970, 1, 1), student.LastPresence);
        }

        [Fact]
        public async Task GetPromotion_ReturnsPromotionAndStudents()
        {
            // Given
            var (token, promoId) = await Auth();

            var promo = await db.Promotions
                .Include(p => p.Students)
                .FirstAsync(p => p.Id == promoId);

            promo.Students.Add(new Student()
                {FullName = "Arsène LAPOSTOLET", LastPresence = new DateTime(2020, 2, 18)});
            db.Promotions.Update(promo);
            await db.SaveChangesAsync();

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var getPromotion = await client.GetAsync($"api/promotions/{promoId}");

            // Then
            Assert.True(getPromotion.IsSuccessStatusCode);
            var result = await getPromotion.Content.ReadAsAsync<PromotionFullDto>();

            Assert.Equal("M1 APP LSI 1", result.ClassName);
            Assert.Equal(promoId, result.Id);
            Assert.Single(result.Students);
            var student = result.Students.First();
            Assert.Equal("Arsène LAPOSTOLET", student.FullName);
            Assert.Equal(new DateTime(2020, 2, 18), student.LastPresence);
        }
    }
}