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

namespace Data.Commands
{
    public class BulkInsertLogEntropysCommand : ICommand<IEnumerable<LogEntropy>>
    {
        private IEnumerable<LogEntropy> LogEntropyList { get; set; }

        public BulkInsertLogEntropysCommand(IEnumerable<LogEntropy> logEntropyList)
        {
            LogEntropyList = logEntropyList;
        }

        public IEnumerable<LogEntropy> Execute()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                string processQuery = "INSERT INTO LogEntropy VALUES (@Symbol, @Accession, @LogEntropyTerm)";
                connection.Execute(processQuery, LogEntropyList);
                return null;
            }
        }
    }
}
