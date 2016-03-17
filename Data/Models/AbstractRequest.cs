using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class NetworkRequest
    {
        public IEnumerable<string> MirnaEnumerable { get; set; }
        public IEnumerable<string> TermEnumerable { get; set; }  
    }
}
