using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Commands;
using Data.Dispatchers;
using Data.Models;

namespace Jobs.Batch
{
    public class LoadVectorsJob
    {
        public void Execute()
        {
            int count = 683;
            string line;
            var cmd = new CommandDispatcher();
            var vectorData = new List<VectorJobData>();
            // Read the file and display it line by line.
            var file =
               new System.IO.StreamReader(@"C:\Users\Brandon Curry\Documents\Visual Studio 2015\Projects\miRNAWeb\Jobs\Files\final.txt");
            while ((line = file.ReadLine()) != null)
            {
                var temp = line.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
                vectorData.Add(new VectorJobData
                {
                    VectorMetaData = new VectorMetaData
                    {
                        Name = temp[0],
                        Type = "term",
                        VectorMetaDataId = count
                    },
                    Vector = new Vector { Values = Array.ConvertAll(temp.Skip(1).ToArray(), double.Parse)}
                });

                count++;
            }


            //cmd.Dispatch(new BulkInsertAbstractsCommand(abstractList));
            file.Close();

            vectorData = vectorData.Skip(36372).ToList();
            vectorData.ForEach(x => cmd.Dispatch(new BulkInsertVectorsCommand(x)));
                 
        }
    }
}
