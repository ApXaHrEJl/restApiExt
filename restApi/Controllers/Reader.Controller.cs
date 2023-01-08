using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using Microsoft.AspNetCore.Mvc;
using restApi.Data;
using restApi.Data.Dto;
using restApi.Data.Services;

namespace restApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [EnableCors(origins: "http://localhost:5173", headers: "*", methods: "*")]
  public class ReaderController : ControllerBase
  {
    private IReaderService Service;
    private IBookService BookService;

    public ReaderController(IReaderService service, IBookService bookService)
    {
      Service = service;
      BookService = bookService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Reader>> GetAll()
    {
      var items = Service.GetAll();

      return Ok(items);
    }

    [HttpPost]
    public ActionResult<Reader> AddReader(ReaderDto reader)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var item = Service.AddReader(reader);

      return Ok(item);
    }

    [HttpPut("{id}", Name = "ChangeReader")]
    public ActionResult<Reader> ChangeReader(ReaderDto reader, Guid id)
    {
      var GettedReader = Service.FindReaderById(id);

      if (GettedReader == null)
      {
        return NotFound();
      }

      var item = Service.ChangeReader(reader, id);

      return Ok(item);
    }

    [HttpGet("{id}", Name = "GetReader")]
    public ActionResult<Reader> FindReaderById(Guid id)
    {
      var item = Service.FindReaderById(id);

      if (item == null)
      {
        return NotFound();
      }

      return Ok(item);
    }

    [HttpDelete("{id}", Name = "DeleteReader")]
    public ActionResult DeleteReader(Guid id)
    {
      var item = Service.FindReaderById(id);

      if (item == null)
      {
        return NotFound();
      }

      Service.DeleteReader(id);

      return Ok();
    }

    [HttpGet("readers/{name}", Name = "GetReaderByName")]
    public ActionResult<IEnumerable<Reader>> GetReaderByName(string name)
    {
      return Ok(Service.FindReadersByName(name.ToLower()));
    }

    [HttpPost("giveBook", Name = "GiveBookToReader")]
    public ActionResult GiveBook(Guid ReaderId, Guid BookId)
    {
      var reader = Service.FindReaderById(ReaderId);

      if (reader == null)
      {
        return NotFound();
      }

      var book = BookService.FindBookById(BookId);

      if (book == null)
      {
        return NotFound();
      }

      Service.GiveBook(ReaderId, BookId);

      return Ok();
    }

    [HttpPost("passBook", Name = "PassBook")]
    public ActionResult PassBook(Guid ReaderId, Guid BookId)
    {
      var reader = Service.FindReaderById(ReaderId);

      if (reader == null)
      {
        return NotFound();
      }

      var book = BookService.FindBookById(BookId);

      if (book == null)
      {
        return NotFound();
      }

      Service.PassBook(ReaderId, BookId);

      return Ok();
    }
  }
}
