using restApi.Data.Dto;
using Microsoft.EntityFrameworkCore;

namespace restApi.Data.Services
{
  public class BookService : IBookService
  {
    private readonly DB _context;

    public BookService(DB context)
    {
      this._context = context;
    }

    public IEnumerable<Book> GetAll()
    {
      return _context.Books.ToList<Book>();
    }

    public Book AddBook(BookDto book)
    {
      var newBook = new Book()
      {
        Id = Guid.NewGuid(),
        name = book.name,
        count = book.commonCount,
        commonCount = book.commonCount,
        vendorCode = book.vendorCode,
        author = book.author,
        publishedDate = book.publishedDate
      };

      _context.Books.Add(newBook);

      _context.SaveChanges();

      return newBook;
    }

    public Book? FindBookById(Guid Id)
    {
      return _context.Books.Find(Id);
    }

    public Book ChangeBook(BookDto book, Guid Id)
    {
      var item = _context.Books.Where(p => p.Id.Equals(Id)).First();

      if (book.name != null)
      {
        item.name = book.name;
      }

      if (book.author != null)
      {
        item.author = book.author;
      }

      if (book.vendorCode != null)
      {
        item.vendorCode = book.vendorCode;
      }

      if (book.publishedDate != DateTime.MinValue)
      {
        item.publishedDate = book.publishedDate;
      }

      if (book.commonCount > 0)
      {
        item.commonCount = book.commonCount;
      }

      if (item.count > item.commonCount)
      {
        item.count = item.commonCount;
      }

      _context.Books.Update(item);

      var passedBook = _context.PassedBooks.Where(p => p.BookId.Equals(Id)).First();

      if (item.name != null)
        passedBook.Name = item.name;

      _context.PassedBooks.Update(passedBook);

      _context.SaveChanges();

      return item;
    }

    public void DeleteBook(Guid Id)
    {
      var book = _context.Books.Find(Id);

      if (book != null)
      {
        var passedBook = _context.PassedBooks.Where(p => p.BookId.Equals(Id)).First();
        if (passedBook != null)
        {
          _context.PassedBooks.Remove(passedBook);
        }

        _context.Books.Remove(book);
        _context.SaveChanges();
      }
    }

    public IEnumerable<Book> GetIssuedBooks()
    {
      return _context.Books.Where(b => b.count < b.commonCount).ToList();
    }

    public IEnumerable<Book> GetAvailableBooks()
    {
      return _context.Books.Where(b => b.count > 0).ToList();
    }

    public IEnumerable<Book> FindBooksByName(string name)
    {
      return _context.Books.Where(b => EF.Functions.Like(b.name.ToLower(), $"%{name}%")).ToList();
    }

    public IEnumerable<PassedBookDto> GetPassedBooks()
    {
      var books = _context.PassedBooks.ToList();

      var dtos = new List<PassedBookDto>();

      foreach (var book in books)
      {
        dtos.Add(new PassedBookDto()
        {
          BookId = book.BookId,
          ReaderId = book.ReaderId,
          Name = book.Name
        });
      }

      return dtos;
    }
  }
}
