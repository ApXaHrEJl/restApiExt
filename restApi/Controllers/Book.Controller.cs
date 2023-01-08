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
  public class BookController : ControllerBase
  {
    private IBookService Service;

    public BookController(IBookService service)
    {
      Service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Book>> GetAll()
    {
      var items = Service.GetAll();

      return Ok(items);
    }

    [HttpPost]
    public ActionResult<Book> AddBook(BookDto book)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var item = Service.AddBook(book);
      return Ok(item);
    }

    [HttpGet("{id}", Name = "GetBook")]
    public ActionResult<Book> GetBookById(Guid id)
    {
      var item = Service.FindBookById(id);

      if (item == null)
      {
        return NotFound();
      }

      return Ok(item);
    }

    [HttpPut("{id}", Name = "ChangeBook")]
    public ActionResult<Book> ChangeBook(BookDto book, Guid id)
    {
      var GettedBook = Service.FindBookById(id);

      if (GettedBook == null)
      {
        return NotFound();
      }

      var item = Service.ChangeBook(book, id);

      return Ok(item);
    }

    [HttpDelete("{id}", Name = "DeleteBook")]
    public ActionResult DeleteBook(Guid id)
    {
      var item = Service.FindBookById(id);

      if (item == null)
      {
        return NotFound();
      }

      Service.DeleteBook(id);

      return Ok();
    }

    [HttpGet("issuedBooks", Name = "GetIssuedBooks")]
    public ActionResult<IEnumerable<Book>> GetIssuedBooks()
    {
      return Ok(Service.GetIssuedBooks());
    }

    [HttpGet("availableBooks", Name = "GetAvailableBooks")]
    public ActionResult<IEnumerable<Book>> GetAvailableBooks()
    {
      return Ok(Service.GetAvailableBooks());
    }

    [HttpGet("books/{name}", Name = "GetBookByName")]
    public ActionResult<IEnumerable<Book>> GetBookByName(string name)
    {
      return Ok(Service.FindBooksByName(name.ToLower()));
    }

    [HttpGet("passedBooks")]
    public ActionResult<IEnumerable<PassedBookDto>> GetPassedBook()
    {
      return Ok(Service.GetPassedBooks());
    }
  }
}
