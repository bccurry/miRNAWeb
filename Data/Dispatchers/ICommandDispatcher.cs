using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Dispatchers
{
    public interface ICommandDispatcher
    {
        TResult Dispatch<TResult>(ICommand<TResult> command);
    }

    public interface ICommand<TResult>
    {
        TResult Execute();
    }

    public class CommandDispatcher : ICommandDispatcher
    {

        public TResult Dispatch<TResult>(ICommand<TResult> command)
        {
            return command.Execute();
        }
    }
}
