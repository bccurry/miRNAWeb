using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private const string RootDocument = "/index.html";

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }   

        // Adjust Path For UI Router
//        protected void Application_BeginRequest(Object sender, EventArgs e)
//        {
//            string url = Request.Url.LocalPath;
//            if (!System.IO.File.Exists(Context.Server.MapPath(url)))
//                Context.RewritePath(RootDocument);
//        }
    }
}
