namespace restApi.Data
{
  public class PassedBook
  {
    public Guid Id { get; set; }

    public Book Book { get; set; }
    public Guid BookId { get; set; }

    public string Name { get; set; }
    public Reader Reader { get; set; }
    public Guid ReaderId { get; set; }
  }
}
