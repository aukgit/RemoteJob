using Dropbox.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DropBoxRestApi.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public void DownloadPdf(string localFilePath)
        {
            DropboxClient client2 = new DropboxClient("cU5M-asdgfsdfsdfds3434435dfgfgvXoAMCFyOXH");
            string folder = "MyFolder";
            string file = "Test PDF.pdf";
            using (var response = await client.Files.DownloadAsync("/" + folder + "/" + file))
            {
                using (var fileStream = File.Create(localFilePath))
                {
                    (await response.GetContentAsStreamAsync()).CopyTo(fileStream);
                }
            }
        }

    }
}