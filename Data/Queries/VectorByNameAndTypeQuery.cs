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
    public class VectorByNameAndTypeQuery: IQuery<Vector>
    {
        private string Name { get; set; }
        private string Type { get; set; }
        public VectorByNameAndTypeQuery(string name, string type)
        {
            Name = name;
            Type = type;
        }

        public Vector Retrieve()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                var @params = new { Name, Type };
                const string storedProcedure = "dbo.GetVectorByNameAndType";
                var result = new Vector
                {
                    Values = connection.Query<double>(storedProcedure, @params, commandType: CommandType.StoredProcedure).ToArray()
                };

                if (result.Values.Length != 449)
                {
                    var xxxxx = "";
                }

                return result;


            }
        }
    }
}
