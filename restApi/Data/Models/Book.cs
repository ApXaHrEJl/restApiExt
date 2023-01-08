using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace restApi.Data
{
  public class Book
  {
    public Guid Id { get; set; }
    public string? name { get; set; }
    public string? author { get; set; }
    public string? vendorCode { get; set; }
    public DateTime publishedDate { get; set; }
    public int count { get; set; }
    public int commonCount { get; set; }
  }
}
