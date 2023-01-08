using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using restApi.Data.Dto;

namespace restApi.Data.Services
{
  public interface IReaderService
  {
    IEnumerable<Reader> GetAll();
    Reader AddReader(ReaderDto reader);
    Reader? FindReaderById(Guid Id);
    Reader ChangeReader(ReaderDto reader, Guid Id);
    void DeleteReader(Guid Id);
    IEnumerable<Reader> FindReadersByName(string name);
    void GiveBook(Guid ReaderId, Guid BookId);
    void PassBook(Guid ReaderId, Guid BookId);
  }
}
