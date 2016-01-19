using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Data.Dispatchers;
using Data.Gateways;

namespace Data.Queries
{
    public class AllVectorIdsQuery: IQuery<IEnumerable<int>>
    {
        public IEnumerable<int> Retrieve()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                const string storedProcedure = "dbo.GetAllVectorIds";                
                return connection.Query<int>(storedProcedure, null, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
