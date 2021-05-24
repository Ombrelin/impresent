using System;
using System.Linq;
using Impresent.Web;
using Impresent.Web.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ImPresent.Tests.Integration
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        public ApplicationDbContext Context { get; private set; }
        private readonly string connectionString = $"DataSource=:memory:";
        private readonly SqliteConnection connection;

        public CustomWebApplicationFactory()
        {
            connection = new SqliteConnection(connectionString);
            connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            Environment.SetEnvironmentVariable("JWT_SECRET","L*$w56jr!XZQZ$CFNQ7w$bM&@oDQccNX4Um4RpKhtMQLhzRWM^fo$MGgoEPoSCrmonNn6pBqePLC&kTyb6@KcWd3U%zRftyVzQvJSMZW*QAg3!kHh&gD8zR7w6yGrS64");
            builder.UseEnvironment("Development");
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType ==
                         typeof(DbContextOptions<ApplicationDbContext>));

                services.Remove(descriptor);
                // Create a new service provider.
                var serviceProvider = new ServiceCollection()
                    .AddEntityFrameworkSqlite()
                    .BuildServiceProvider();

                // Add a database context (AppDbContext) using an in-memory database for testing.
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseSqlite(connection);
                    options.UseInternalServiceProvider(serviceProvider);
                });

                // Build the service provider.
                var sp = services.BuildServiceProvider();

                // Create a scope to obtain a reference to the database contexts
                var scope = sp.CreateScope();
                var scopedServices = scope.ServiceProvider;
                var appDb = scopedServices.GetRequiredService<ApplicationDbContext>();
                Context = appDb;
                Context.Database.EnsureCreated();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            this.connection.Close();
        }
    }
}