using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Configuration;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Data.Gateways
{
    public static class MirnaGateway
    {
        public const string Connection =
            "Data Source=localhost;Initial Catalog = miRNA; Integrated Security = True";
    }
}
