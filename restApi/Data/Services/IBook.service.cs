using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using restApi.Data.Dto;

namespace restApi.Data.Services
{
  public interface IBookService
  {
    IEnumerable<Book> GetAll();
    Book AddBook(BookDto book);
    Book? FindBookById(Guid Id);
    Book ChangeBook(BookDto book, Guid Id);
    void DeleteBook(Guid Id);
    IEnumerable<Book> GetIssuedBooks();
    IEnumerable<Book> GetAvailableBooks();
    IEnumerable<Book> FindBooksByName(string name);
    IEnumerable<PassedBookDto> GetPassedBooks();
  }
}
