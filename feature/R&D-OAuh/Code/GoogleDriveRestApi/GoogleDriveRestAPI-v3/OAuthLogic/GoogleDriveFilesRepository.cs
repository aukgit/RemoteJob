using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Elmah;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Download;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using GoogleDriveRestAPI_v3.Model;
using GoogleDriveRestAPI_v3.Service;

namespace GoogleDriveRestAPI_v3.OAuthLogic {
    public class GoogleDriveFilesRepository {
        public static string[] Scopes = { DriveService.Scope.Drive };

        public async Task<DriveService> GetService() {
            string path = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/client_secret.json");
            UserCredential credential = null;

            LogService.Log<GoogleDriveFilesRepository>("path", path);
            using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read)) {

                string folderPath = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/");

                if (folderPath != null) {
                    string filePath = Path.Combine(folderPath, "DriveServiceCredentials");
                    LogService.Log<GoogleDriveFilesRepository>("FolderPath", folderPath);
                    LogService.Log<GoogleDriveFilesRepository>("FilePath", filePath);
                    if (Directory.Exists(filePath)) {
                        var directoryInfo = new DirectoryInfo(filePath);

                        //foreach (FileInfo file in directoryInfo.GetFiles()) {
                        //    file.Delete();
                        //}

                        //foreach (DirectoryInfo dir in directoryInfo.GetDirectories()) {
                        //    dir.Delete(true);
                        //}
                    }

                    LogService.Log<GoogleDriveFilesRepository>("FilePath", filePath);

                    credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                        GoogleClientSecrets.Load(stream).Secrets,
                        Scopes,
                        "user",
                        CancellationToken.None,
                        new FileDataStore(filePath, true));
                }
            }

            //Create Drive API service.
            DriveService service = new DriveService(new BaseClientService.Initializer() {
                HttpClientInitializer = credential,
                ApplicationName = "GoogleDriveRestAPI-v3",
            });

            return service;
        }

        public async Task<List<GoogleDriveFiles>> GetDriveFiles() {
            DriveService service = await GetService();

            // Define parameters of request.
            FilesResource.ListRequest fileListRequest = service.Files.List();

            //listRequest.PageSize = 10;
            //listRequest.PageToken = 10;
            fileListRequest.Fields = "nextPageToken, files(id, name, size, version, trashed, createdTime)";

            // List files.
            IList<Google.Apis.Drive.v3.Data.File> files = fileListRequest.Execute().Files;
            List<GoogleDriveFiles> fileList = new List<GoogleDriveFiles>();

            if (files != null && files.Count > 0) {
                foreach (var file in files) {
                    GoogleDriveFiles File = new GoogleDriveFiles {
                        Id = file.Id,
                        Name = file.Name,
                        Size = file.Size,
                        Version = file.Version,
                        CreatedTime = file.CreatedTime
                    };
                    fileList.Add(File);
                }
            }
            return fileList;
        }

        public async void FileUpload(HttpPostedFileBase file) {
            if (file != null && file.ContentLength > 0) {
                DriveService service = await GetService();

                string path = Path.Combine(HttpContext.Current.Server.MapPath("~/GoogleDriveFiles"), file.FileName);
                file.SaveAs(path);
                LogService.Log<GoogleDriveFilesRepository>("Uploaded data", "true");
                new Thread(() => {
                    var fileMetaData = new Google.Apis.Drive.v3.Data.File();
                    fileMetaData.Name = Path.GetFileName(file.FileName);
                    fileMetaData.MimeType = MimeMapping.GetMimeMapping(path);

                    LogService.Log<GoogleDriveFilesRepository>("Uploading to google drive", "in progress");

                    FilesResource.CreateMediaUpload request;

                    using (var stream = new System.IO.FileStream(path, System.IO.FileMode.Open)) {
                        request = service.Files.Create(fileMetaData, stream, fileMetaData.MimeType);
                        request.Fields = "id";
                        request.Upload();
                        LogService.Log<GoogleDriveFilesRepository>("Uploading to google drive", "done");
                    }

                }).Start();
            }
        }

        public async Task<string> DownloadGoogleFile(string fileId) {
            DriveService service = await GetService();

            string folderPath = System.Web.HttpContext.Current.Server.MapPath("/GoogleDriveFiles/");
            FilesResource.GetRequest request = service.Files.Get(fileId);

            string fileName = request.Execute().Name;
            string filePath = System.IO.Path.Combine(folderPath, fileName);

            MemoryStream stream1 = new MemoryStream();

            request.MediaDownloader.ProgressChanged += (Google.Apis.Download.IDownloadProgress progress) => {
                switch (progress.Status) {
                    case DownloadStatus.Downloading: {
                            //Console.WriteLine(progress.BytesDownloaded);
                            break;
                        }
                    case DownloadStatus.Completed: {
                            //Console.WriteLine("Download complete.");
                            SaveStream(stream1, filePath);
                            break;
                        }
                    case DownloadStatus.Failed: {
                            //Console.WriteLine("Download failed.");
                            break;
                        }
                }
            };
            request.Download(stream1);
            return filePath;
        }

        private void SaveStream(MemoryStream stream, string filePath) {
            using (System.IO.FileStream file = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite)) {
                stream.WriteTo(file);
            }
        }

        public async void DeleteFile(GoogleDriveFiles files) {
            DriveService service = await GetService();
            try {
                // Initial validation.
                if (service == null)
                    throw new ArgumentNullException("service");

                if (files == null)
                    throw new ArgumentNullException(files.Id);

                // Make the request.
                service.Files.Delete(files.Id).Execute();
            } catch (Exception ex) {
                throw new Exception("Request Files.Delete failed.", ex);
            }
        }
    }
}