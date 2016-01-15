
namespace Data.Dispatchers
{
    public interface IQueryDispatcher
    {
        TResult Dispatch<TResult>(IQuery<TResult> query);
    }

    public interface IQuery<TResult>
    {
        TResult Retrieve();
    }

    public class QueryDispatcher : IQueryDispatcher
    {
        public TResult Dispatch<TResult>(IQuery<TResult> query)
        { 
           return query.Retrieve();
        }
    }
}
