using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using restApi.Data.Dto;

namespace restApi.Data.Services
{
  public class ReaderService : IReaderService
  {
    private readonly DB _context;

    public ReaderService(DB context)
    {
      this._context = context;
    }

    public IEnumerable<Reader> GetAll()
    {
      return _context.Readers.ToList<Reader>();
    }

    public Reader AddReader(ReaderDto reader)
    {
      Reader newReader = new Reader()
      {
        Id = Guid.NewGuid(),
        name = reader.name,
        birthDate = reader.birthDate
      };

      _context.Readers.Add(newReader);
      _context.SaveChanges();

      return newReader;
    }

    public void DeleteReader(Guid Id)
    {
      var reader = _context.Readers.Find(Id);

      if (reader == null) return;

      _context.Readers.Remove(reader);
      _context.SaveChanges();
    }

    public Reader ChangeReader(ReaderDto reader, Guid Id)
    {
      var item = _context.Readers.Where(r => r.Id.Equals(Id)).First();

      if (reader.name != null)
      {
        item.name = reader.name;
      }

      if (reader.birthDate != DateTime.MinValue)
      {
        item.birthDate = reader.birthDate;
      }

      _context.Readers.Update(item);
      _context.SaveChanges();

      return item;
    }

    public Reader? FindReaderById(Guid Id)
    {
      return _context.Readers.Find(Id);
    }

    public IEnumerable<Reader> FindReadersByName(string name)
    {
      return _context.Readers.Where(r => EF.Functions.Like(r.name.ToLower(), $"%{name}%")).ToList();
    }

    public void GiveBook(Guid ReaderId, Guid BookId)
    {
      var book = _context.Books.Find(BookId);

      if (book.count > 0)
      {
        book.count--;
      }

      // _context.Entry(book).CurrentValues.SetValues(book);
      _context.Books.Update(book);

      var reader = _context.Readers.Find(ReaderId);
      // reader.books.Add(book.Id.ToString());

      var passedBook = new PassedBook()
      {
        ReaderId = ReaderId,
        Name = book.name,
        BookId = BookId,
      };

      _context.PassedBooks.Add(passedBook);

      _context.Readers.Update(reader);

      _context.SaveChanges();
    }

    public void PassBook(Guid ReaderId, Guid BookId)
    {
      var book = _context.Books.Find(BookId);
      if (book.count < book.commonCount)
      {
        book.count++;
      }

      // _context.Entry(book).CurrentValues.SetValues(book);
      _context.Books.Update(book);

      var reader = _context.Readers.Find(ReaderId);
      // reader.books.Remove(book.Id.ToString());
      var passedBook = _context.PassedBooks.Where(p => p.BookId.Equals(BookId) && p.ReaderId.Equals(ReaderId)).First();

      if (passedBook == null) return;

      _context.PassedBooks.Remove(passedBook);

      _context.Readers.Update(reader);

      _context.SaveChanges();
    }
  }
}
