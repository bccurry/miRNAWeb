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
using Data.Models;

namespace Data.Queries
{
    public class AllVectorMetaDataQuery: IQuery<IEnumerable<VectorMetaData>>
    {
        public IEnumerable<VectorMetaData> Retrieve()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                const string storedProcedure = "dbo.GetAllVectorMetaData";                
                return connection.Query<VectorMetaData>(storedProcedure, null, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
