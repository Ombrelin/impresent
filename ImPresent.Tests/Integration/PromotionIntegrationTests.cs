using System;
using System.Collections.Generic;
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
            Assert.Equal(promoId, result.Id);
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
            Assert.Equal(HttpStatusCode.BadRequest, loginResponse.StatusCode);
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
            var promo = await CreateTestPromotion();


            // When
            var getPromotion = await client.GetAsync($"api/promotions/{promo.Id}");

            // Then
            Assert.True(getPromotion.IsSuccessStatusCode);
            var result = await getPromotion.Content.ReadAsAsync<PromotionFullDto>();

            Assert.Equal("M1 APP LSI 1", result.ClassName);
            Assert.Equal(promo.Id, result.Id);
            Assert.Single(result.Students);
            var student = result.Students.First();
            Assert.Equal("Arsène LAPOSTOLET", student.FullName);
            Assert.Equal(DateTime.Today, student.LastPresence);
        }

        [Fact]
        public async Task GetNonExistingPromotion_Returns404()
        {
            // When
            var getPromotion = await client.GetAsync($"api/promotions/639d1a4e-8e5d-425c-8cb1-799b15c253e4");

            // Then
            Assert.Equal(HttpStatusCode.NotFound, getPromotion.StatusCode);
        }


        [Fact]
        public async Task AddNewPresenceDay()
        {
            // Given
            var date = DateTime.Today.AddDays(3);
            var promo = await CreateTestPromotion();
            var presenceDayDto = new CreatePresenceDayDto() {Date = date};

            var loginDto = new AuthDto()
            {
                PromotionName = "M1 APP LSI 1",
                Password = "TestTest1"
            };


            var tokenResponse = await client.PostAsJsonAsync("api/auth", loginDto);
            var tokenDto = await tokenResponse.Content.ReadAsAsync<TokenDto>();

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", tokenDto.Token);

            // When
            var addPresenceDay = await client.PostAsJsonAsync($"api/promotions/{promo.Id}/days", presenceDayDto);

            // Then
            Assert.True(addPresenceDay.IsSuccessStatusCode);
            var result = await addPresenceDay.Content.ReadAsAsync<PresenceDayDto>();

            Assert.Equal(result.Date, presenceDayDto.Date);

            promo = await db.Promotions
                .Include(p => p.PresenceDays)
                .FirstAsync(p => p.Id == promo.Id);

            Assert.Single(promo.PresenceDays);
            var presenceDay = promo.PresenceDays.First();
            Assert.Equal(date, presenceDay.Date);
        }

        private async Task<Promotion> CreateTestPromotion()
        {
            var promo = new Promotion()
            {
                Password = BCrypt.Net.BCrypt.HashPassword("TestTest1"),
                ClassName = "M1 APP LSI 1",
                Students = new List<Student>
                {
                    new Student()
                        {FullName = "Arsène LAPOSTOLET", LastPresence = DateTime.Today}
                }
            };
            await db.Promotions.AddAsync(promo);
            await db.SaveChangesAsync();
            return promo;
        }

        private async Task<Promotion> CreateTestPromotionWithDays()
        {
            var promo = await CreateTestPromotion();
            var day = new PresenceDay() {Date = DateTime.Today.AddDays(3)};
            promo.PresenceDays = new List<PresenceDay> {day};

            db.Promotions.Update(promo);
            await db.SaveChangesAsync();

            return promo;
        }

        [Fact]
        public async Task GetPromotion_ReturnsPromotionAndStudentsAndDays()
        {
            // Given
            var promo = await CreateTestPromotionWithDays();

            // When
            var getPromotion = await client.GetAsync($"api/promotions/{promo.Id}");

            // Then
            Assert.True(getPromotion.IsSuccessStatusCode);
            var result = await getPromotion.Content.ReadAsAsync<PromotionFullDto>();

            Assert.Equal("M1 APP LSI 1", result.ClassName);
            Assert.Equal(promo.Id, result.Id);
            Assert.Single(result.Students);
            Assert.Single(result.PresenceDays);

            var student = result.Students.First();
            Assert.Equal("Arsène LAPOSTOLET", student.FullName);
            Assert.Equal(DateTime.Today, student.LastPresence);

            var day = result.PresenceDays.First();
            Assert.Equal(DateTime.Today.AddDays(3), day.Date);
        }

        [Fact]
        public async Task Volunteer()
        {
            // Given
            var promo = await CreateTestPromotionWithDays();
            var student = promo.Students.First();
            var presenceDay = promo.PresenceDays.First();
            var dto = new CreateVolunteeringDto()
            {
                StudentId = student.Id
            };

            // When

            var volunteer = await client
                .PostAsJsonAsync($"api/promotions/{promo.Id}/days/{presenceDay.Id}/volunteers", dto);

            // Then
            Assert.True(volunteer.IsSuccessStatusCode);
            var result = await volunteer.Content.ReadAsAsync<VolunteeringDto>();
            Assert.Equal(student.Id, result.Student.Id);
            Assert.Equal(presenceDay.Id, result.PresenceDay.Id);

            Assert.Single(db.Volunteerings);
            var volunteering = await db.Volunteerings.FirstAsync();
            Assert.Equal(student.Id, volunteering.Student.Id);
            Assert.Equal(presenceDay.Id, volunteering.PresenceDay.Id);
        }

        [Fact]
        public async Task GetDesignated()
        {
            // Given
            var promo = await CreateTestPromotionWithDays();
            promo.Students.Add(new Student()
            {
                FullName = "Jean Michel REMEUR",
                LastPresence = DateTime.Today.AddDays(-3)
            });
            var student = new Student()
            {
                FullName = "Maud GELLEE",
                LastPresence = DateTime.Today.AddDays(-5)
            };
            promo.Students.Add(student);
            promo.Students.Add(new Student()
            {
                FullName = "Thomas LACAZE",
                LastPresence = DateTime.Today.AddDays(-4)
            });
            db.Promotions.Update(promo);
            await db.SaveChangesAsync();

            var presenceDay = promo.PresenceDays.First();
            await db.Volunteerings.AddAsync(new Volunteering()
            {
                Student = student,
                PresenceDay = presenceDay
            });
            await db.SaveChangesAsync();

            // When

            var designated = await client
                .GetAsync($"api/promotions/{promo.Id}/days/{presenceDay.Id}/designated?number=1");

            // Then
            Assert.True(designated.IsSuccessStatusCode);
            var result = await designated.Content.ReadAsAsync<List<StudentDto>>();
            Assert.Single(result);

            Assert.Equal("Thomas LACAZE", result.First().FullName);
        }

        [Fact]
        public async Task GetVolunteerings()
        {
            // Given
            var promo = await CreateTestPromotionWithDays();
            var student = promo.Students.First();
            var presenceDay = promo.PresenceDays.First();
            var volunteering = new Volunteering() {Student = student, PresenceDay = presenceDay};
            await db.Volunteerings.AddAsync(volunteering);
            await db.SaveChangesAsync();

            // When
            var volunteers = await client.GetAsync($"api/promotions/{promo.Id}/days/{presenceDay.Id}/volunteers");
            Assert.True(volunteers.IsSuccessStatusCode);
            var result = await volunteers.Content.ReadAsAsync<VolunteeringsDto>();
            Assert.Single(result.Students);

            Assert.Equal(student.Id, result.Students.First().Id);
            Assert.Equal(presenceDay.Id, result.PresenceDay.Id);
        }
    }
}