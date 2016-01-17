using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Data.Dispatchers;
using Data.Models;

namespace Data.Queries
{
    public class ValidateSearchTermQuery : IQuery<bool>
    {
        private readonly IDbConnection _db = new SqlConnection(@"Data Source=localhost;Initial Catalog=miRNA;Integrated Security=True");
        private string SearchTerm { get; set; }
        public ValidateSearchTermQuery(string searchTerm)
        {
            SearchTerm = searchTerm;
        }
        public bool Retrieve()
        {
            using (IDbConnection connection = _db)
            {
                var @params = new { SearchTerm = SearchTerm };
                const string storedProcedure = "dbo.ValidateSearchTerm";
                return connection.Query<bool>(storedProcedure, @params, commandType: CommandType.StoredProcedure).Single();
            }
        }
    }
}
