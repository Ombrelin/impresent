using System;

namespace Impresent.Web.Services
{
    public class SecretService : ISecretsService
    {
        public string DatabaseConnectionUrl => Environment.GetEnvironmentVariable("DATABASE_URL");
        public string JwtSecret => Environment.GetEnvironmentVariable("JWT_SECRET");
    }
}