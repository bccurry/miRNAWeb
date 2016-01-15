using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using Data.Dispatchers;
using Data.Models;

namespace Data.Queries
{

    public class GetAllVectorsQuery : IQuery<IEnumerable<Vector>>
    {
            private readonly IDbConnection _db = new SqlConnection(@"Data Source=(localdb)\Projects;Initial Catalog=Test;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False");

            public IEnumerable<Vector> Retrieve()
            {
                using (IDbConnection connection = _db)
                {
                    const string storedProcedure = "dbo.GetAllVectors";
                    return connection.Query<Vector>(storedProcedure, null, commandType: CommandType.StoredProcedure);
                }
            }
    }
}
