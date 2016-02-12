using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Commands;
using Data.Dispatchers;
using Data.Models;
using Jobs.Batch;

namespace Jobs
{
    class Program
    {
        static void Main(string[] args)
        {
            //var job = new LoadAbstractsJob();
            var job = new LoadLogEntropyJob();
            job.Execute();
            Console.WriteLine("Finished");
            Console.ReadLine();
        }
    }
}
