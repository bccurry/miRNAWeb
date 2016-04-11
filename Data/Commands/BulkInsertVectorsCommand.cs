using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Dapper;
using Data.Dispatchers;
using Data.Gateways;
using Data.Models;

namespace Data.Commands
{ 
    public class BulkInsertVectorsCommand : ICommand<bool>
    {
        private VectorJobData VectorData { get; set; }

        public BulkInsertVectorsCommand(VectorJobData vectorData)
        {
            VectorData = vectorData;
        }

        public bool Execute()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                var @params = new
                {
                    VectorMetaData_UID = VectorData.VectorMetaData.VectorMetaDataId,
                    Name = VectorData.VectorMetaData.Name.Length <= 50 ? VectorData.VectorMetaData.Name : VectorData.VectorMetaData.Name.Take(50).ToString(),
                    VectorData.VectorMetaData.Type
                };
                string processQuery = "INSERT INTO VectorMetaData VALUES (@VectorMetaData_UID, @Type, @Name)";
                connection.Execute(processQuery, @params, null, commandTimeout: 200);

                processQuery = "INSERT INTO Vector VALUES (@VectorMetaData_UID, @Value, @Vector_UID)";

                foreach (var value in VectorData.Vector.Values)
                {
                    connection.Execute(processQuery, new { VectorMetaData_UID = VectorData.VectorMetaData.VectorMetaDataId, Value = value, Vector_UID = 0}, null, commandTimeout: 200);
                }
            }

            return true;
        }
    }
}
