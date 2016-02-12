using System;
using System.Collections.Generic;
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
    public class LogEntropyQuery: IQuery<IEnumerable<LogEntropyResult>>
    {
        private IEnumerable<string> SearchEnumerable { get; set; }

        public LogEntropyQuery(IEnumerable<string> searchEnumerable)
        {
            SearchEnumerable = searchEnumerable;
        }

        public IEnumerable<LogEntropyResult> Retrieve()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                const string query = @"SELECT LogEntropyTerm FROM LogEntropy WHERE Symbol IN @SearchEnumerable";
                var result = connection.Query<LogEntropyResult>(query, new { SearchEnumerable }).ToList();
                return SearchEnumerable.Count() > 1 ? result.GroupBy(x => x.LogEntropyTerm)
                                                                   .Where(g => g.Count() == SearchEnumerable.Count())
                                                                   .Select(g => new LogEntropyResult { LogEntropyTerm = g.Key }) 
                                                           : result;

                
            }
        }
    }
}
