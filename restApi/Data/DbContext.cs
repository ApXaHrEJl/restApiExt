using Microsoft.EntityFrameworkCore;
using restApi.Data;

public class DB : DbContext
{
  public DB(DbContextOptions<DB> options) : base(options) { }
  public DbSet<Book> Books { get; set; }
  public DbSet<Reader> Readers { get; set; }
  public DbSet<PassedBook> PassedBooks { get; set; }
}
