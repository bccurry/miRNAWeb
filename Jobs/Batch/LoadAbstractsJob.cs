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
    public class LoadAbstractsJob
    {
        public void Execute()
        {
            string line;
            var cmd = new CommandDispatcher();
            var abstractList = new List<Abstract>();
            // Read the file and display it line by line.
            var file =
               new System.IO.StreamReader(@"C:\Users\Brandon Curry\Documents\Visual Studio 2015\Projects\miRNAWeb\Jobs\Files\miRNA_PMID_mapping.txt");
            while ((line = file.ReadLine()) != null)
            {
                var temp = line.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
                abstractList.AddRange(temp[3].Split(';').Where(pmid => pmid.Any()).Select(pmid => new Abstract
                {
                    Accession = temp[0],
                    Symbol = temp[1],
                    Pmid = pmid
                }));
            }

            cmd.Dispatch(new BulkInsertAbstractsCommand(abstractList));
            file.Close();
        }
    }
}
