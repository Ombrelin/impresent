using impresent.Model;
using Microsoft.EntityFrameworkCore;

namespace impresent.Database
{
    public class ApplicationDbContext: DbContext
    {
        public DbSet<Promotion> Users { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Promotion>().HasKey(u => u.Id);
            modelBuilder.Entity<Promotion>().Property(u => u.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Promotion>().Property(u => u.ClassName).IsRequired();
            modelBuilder.Entity<Promotion>().Property(u => u.Password).IsRequired();
            modelBuilder.Entity<Promotion>().HasMany<Student>(p => p.Students).WithOne()
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Student>().HasKey(u => u.Id);
            modelBuilder.Entity<Student>().Property(u => u.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Student>().Property(u => u.FullName).IsRequired();
            modelBuilder.Entity<Student>().Property(u => u.LastPresence).IsRequired();
        }
    }
}