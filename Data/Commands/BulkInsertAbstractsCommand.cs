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
    public class BulkInsertAbstractsCommand : ICommand<IEnumerable<Abstract>>
    {
        private IEnumerable<Abstract> AbstractList { get; set; }

        public BulkInsertAbstractsCommand(IEnumerable<Abstract> abstractList)
        {
            AbstractList = abstractList;
        }

        public IEnumerable<Abstract> Execute()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                string processQuery = "INSERT INTO Abstract VALUES (@Pmid, @Accession, @Symbol)";
                connection.Execute(processQuery, AbstractList);
                return null;
            }
        }
    }
}
