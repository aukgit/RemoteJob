using System.IO;
using System.Web;
using System.Web.Mvc;
using System;
using System.Threading.Tasks;
using GoogleDriveRestAPI_v3.Model;
using GoogleDriveRestAPI_v3.OAuthLogic;

namespace GoogleDriveRestAPI_v3.Controllers {
    public class HomeController : Controller {
        #region Google Drive
        private GoogleDriveFilesRepository _googleDriveFilesRepository = new GoogleDriveFilesRepository();

        public ActionResult Home() {

            return View();
        }

        public async Task<ActionResult> GetGoogleDriveFiles() {
            var model = await _googleDriveFilesRepository.GetDriveFiles();
            return View(model);
        }

        public async Task<ActionResult> DeleteFile(GoogleDriveFiles file) {
            _googleDriveFilesRepository.DeleteFile(file);
            return RedirectToAction("GetGoogleDriveFiles");
        }

        public async Task<ActionResult> UploadFile(HttpPostedFileBase file) {
            _googleDriveFilesRepository.FileUpload(file);
            return RedirectToAction("GetGoogleDriveFiles");
        }

        public async void DownloadFile(string id) {
            string FilePath = await _googleDriveFilesRepository.DownloadGoogleFile(id);


            Response.ContentType = "application/zip";
            Response.AddHeader("Content-Disposition", "attachment; filename=" + Path.GetFileName(FilePath));
            Response.WriteFile(System.Web.HttpContext.Current.Server.MapPath("~/GoogleDriveFiles/" + Path.GetFileName(FilePath)));
            Response.End();
            Response.Flush();
        }

        #endregion

    }
}