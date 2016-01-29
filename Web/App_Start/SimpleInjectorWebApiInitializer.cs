using AForge.Math.Metrics;
using Data.Dispatchers;
using Microsoft.AspNet.SignalR;
using Web.Factories;
using Web.Hubs;

[assembly: WebActivator.PostApplicationStartMethod(typeof(Web.App_Start.SimpleInjectorWebApiInitializer), "Initialize")]

namespace Web.App_Start
{
    using System.Web.Http;
    using SimpleInjector;
    using SimpleInjector.Integration.WebApi;
    
    public static class SimpleInjectorWebApiInitializer
    {
        /// <summary>Initialize the container and register it as Web API Dependency Resolver.</summary>
        public static void Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebApiRequestLifestyle();
            
            InitializeContainer(container);

            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);
       
            container.Verify();
            
            GlobalConfiguration.Configuration.DependencyResolver =
                new SimpleInjectorWebApiDependencyResolver(container);
        }
     
        private static void InitializeContainer(Container container)
        {
            container.Register<IQueryDispatcher, QueryDispatcher>(Lifestyle.Transient);
            container.Register<ICommandDispatcher, CommandDispatcher>(Lifestyle.Singleton);
//            container.Register<IMessageHub, MessageHub>(Lifestyle.Singleton);
//            container.RegisterInitializer<MessageHub>(x =>
//            {
//                x.UpdatePercentageFinished =
//                    (count) =>
//                    {
//                        GlobalHost.ConnectionManager.GetHubContext<MessageHub>()
//                            .Clients.All.percentageFinishedClient(count);
//                        return true;
//                    };
//            });
            container.Register<CosineSimilarity>(Lifestyle.Singleton);
            container.Register<ISearchFactory, SearchFactory>(Lifestyle.Transient);
            // For instance:
            // container.Register<IUserRepository, SqlUserRepository>(Lifestyle.Scoped);
        }
    }
}