using Impresent.Web.Model;
using Microsoft.EntityFrameworkCore;

namespace Impresent.Web.Database
{
    public class ApplicationDbContext: DbContext
    {
        public DbSet<Promotion> Promotions { get; set; }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Promotion>().HasKey(u => u.Id);
            modelBuilder.Entity<Promotion>().Property(u => u.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Promotion>().HasIndex(u => u.ClassName).IsUnique();
            modelBuilder.Entity<Promotion>().Property(u => u.Password).IsRequired();
            modelBuilder.Entity<Promotion>().HasMany<Student>(p => p.Students).WithOne()
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Promotion>().HasMany<PresenceDay>(p => p.PresenceDays).WithOne()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Student>().HasKey(u => u.Id);
            modelBuilder.Entity<Student>().Property(u => u.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Student>().Property(u => u.FullName).IsRequired();
            modelBuilder.Entity<Student>().Property(u => u.LastPresence).IsRequired();

            modelBuilder.Entity<PresenceDay>().HasKey(pd => pd.Id);
            modelBuilder.Entity<PresenceDay>().Property(pd => pd.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<PresenceDay>().Property(pd => pd.Date);
        }
    }
}