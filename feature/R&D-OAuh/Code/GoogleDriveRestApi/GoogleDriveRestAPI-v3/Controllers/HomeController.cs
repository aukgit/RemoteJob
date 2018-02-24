using GoogleDriveRestAPI_v3.Models;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace GoogleDriveRestAPI_v3.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult GetGoogleDriveFiles()
        {
            return View(GoogleDriveFilesRepository.GetDriveFiles());
        }

        [HttpPost]
        public ActionResult DeleteFile(GoogleDriveFiles file)
        {
            GoogleDriveFilesRepository.DeleteFile(file);
            return RedirectToAction("GetGoogleDriveFiles");
        }
         
        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase file)
        {
            GoogleDriveFilesRepository.FileUpload(file);
            return RedirectToAction("GetGoogleDriveFiles");
        }

        public void DownloadFile(string id)
        {
            string FilePath = GoogleDriveFilesRepository.DownloadGoogleFile(id);
            

            Response.ContentType = "application/zip";
            Response.AddHeader("Content-Disposition", "attachment; filename=" + Path.GetFileName(FilePath));
            Response.WriteFile(System.Web.HttpContext.Current.Server.MapPath("~/GoogleDriveFiles/" + Path.GetFileName(FilePath)));
            Response.End();
            Response.Flush();
        }
    }
}