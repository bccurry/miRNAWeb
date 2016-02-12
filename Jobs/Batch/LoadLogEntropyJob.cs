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
    public class LoadLogEntropyJob
    {
        public void Execute()
        {
            string line;
            var cmd = new CommandDispatcher();
            var logEntropyList = new List<LogEntropy>();
            // Read the file and display it line by line.
            var file =
               new System.IO.StreamReader(@"C:\Users\Brandon Curry\Documents\Visual Studio 2015\Projects\miRNAWeb\Jobs\Files\miRNA_LE_terms.txt");
            while ((line = file.ReadLine()) != null)
            {
                var temp = line.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
                logEntropyList.AddRange(temp[2].Split(';').Where(le => le.Any()).Select(le => new LogEntropy
                {
                    Accession = temp[0],
                    Symbol = temp[1],
                    LogEntropyTerm = le
                }));
            }

            cmd.Dispatch(new BulkInsertLogEntropysCommand(logEntropyList));
            file.Close();
        }
    }
}
