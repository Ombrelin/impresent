namespace Impresent.Web.Services
{
    public interface ISecretsService
    {
        public string DatabaseConnectionUrl { get; }
        public string JwtSecret { get; }
    }
}