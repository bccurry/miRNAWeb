using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class ResultTerm
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public double Value { get; set; }
        public bool IsActive { get; set; }
        public string Accession { get; set; }
        public string Description { get; set; }
    }
}
