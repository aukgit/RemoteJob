using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Web;

namespace GoogleDriveRestAPI_v3.Service {
    public static class LogService {
        public static void Log<T>(string name, string value,[CallerLineNumber] int lineNumber = 0) {
            var typeName = typeof(T).Name;
            var error = new Elmah.Error(new Exception($"{name} : {value} at line {lineNumber} - File : {typeName}"));
            Elmah.ErrorLog.GetDefault(HttpContext.Current).Log(error);
        }
    }
}