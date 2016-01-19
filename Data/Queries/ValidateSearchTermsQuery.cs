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
    public class ValidateSearchTermQuery : IQuery<VectorMetaData>
    {  
        private string SearchTerm { get; set; }
        public ValidateSearchTermQuery(string searchTerm)
        {
            SearchTerm = searchTerm;
        }
        public VectorMetaData Retrieve()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                var @params = new { SearchTerm = SearchTerm };
                const string storedProcedure = "dbo.ValidateSearchTerm";
                return connection.Query<VectorMetaData>(storedProcedure, @params, commandType: CommandType.StoredProcedure).SingleOrDefault(); ;
            }
        }
    }
}
