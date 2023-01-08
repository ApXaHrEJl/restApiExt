using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace restApi.Data
{
  public class Reader
  {
    public Guid Id { get; set; }
    public string? name { get; set; }
    public DateTime birthDate { get; set; }
  }
}
