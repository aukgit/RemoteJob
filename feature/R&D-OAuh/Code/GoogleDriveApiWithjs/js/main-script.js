// Client ID and API key from the Developer Console
var CLIENT_ID;  // = <YOUR CLIENT KEY HERE>; //also remove line no. 20.

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/drive";
var DOWNLOAD_URL = "https://www.googleapis.com/drive/v3/files/";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var buttons = $("#hide");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    //load Client Key from external File ** remove next line, if u have key and assign key to CLIENT_ID
    readTextFile('./ClientKey.txt');
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}


/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        buttons.css("display", "block");
        listFiles();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        buttons.css("display", "none");
    }
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function (e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title': fileData.name,
            'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });
        if (!callback) {
            callback = function (file) {
                console.log(file);
            };
        }
        request.execute(callback);
    }
}

function downloadFile(fileId, callback) {
    var url = DOWNLOAD_URL + fileId + "?alt=media";
    var reader = new FileReader();
    console.log(fileId);
    if (url) {
        var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.onload = function () {
            console.log(xhr.response);


            //downloading blob data
            var a = document.createElement("a");
            a.style = "display: none";
            document.body.appendChild(a);
            //Create a DOMString representing the blob and point the link element towards it
            var url = window.URL.createObjectURL(xhr.response);
            a.href = url;
            a.download = fileObj[fileId];
            //programatically click the link to trigger the download
            a.click();
            //release the reference to the file by revoking the Object URL
            window.URL.revokeObjectURL(url);


        };
        xhr.onerror = function () {
            console.log(null);
        };
        xhr.send();
    } else {
        console.log(null);
    }
}

function deleteFile(fileId) {
    var request = gapi.client.drive.files.delete({
        'fileId': fileId
    });
    request.execute(function (resp) {
    });
}

$(document).on("click", "#lessen", function () {

    if (arguments.length == 1) data = arguments[0];
});

function hideWelcome() {
    $("#upload-success").hide("slow");
}

function success() {
    console.log("I am Happy");
    $("#upload-success").show();

    var tim = setTimeout(hideWelcome, 3000);
    console.log(tim);
}

function myFile(file) {
    insertFile(file[0], success);
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    location.reload();
}


/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message, fileId, file) {
    var pre = document.getElementById('content');
    var textDiv = $("#con").clone();
    //var textContent = document.createTextNode(message);
    textDiv.text(message);
    //textContent.addClass("col-xs-10");
    textDiv.appendTo(pre);
    //var newLine = document.createTextNode("\n");
    if (arguments.length == 3) {
        var newButton = $("#b").clone();
        newButton.attr("id", fileId);
        newButton.appendTo(pre);
        var ddButton = $("#d").clone();
        ddButton.attr("id", "d" + fileId);
        ddButton.appendTo(pre);
    }
    //pre.appendChild(newLine);
}


var fileObj = {};


/**
 * Print files.
 */
function listFiles() {
    gapi.client.drive.files.list({
        'pageSize': 500,
        'fields': "nextPageToken, files(id, name)"
    }).then(function (response) {
        var files = response.result.files;
        console.log(files.length);
        //console.log(bd);
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //console.log(nb);
                //file id hidden
                appendPre(file.name /*+ ' (' + file.id + ')'*/, file.id.toString(), file);
                fileObj[file.id] = file.name;

            }
        } else {
            appendPre('No files found.');
        }
    });
}

function readTextFile(file)
{
    var client = new XMLHttpRequest();
    client.open('GET', file);
    client.onreadystatechange = function() {
        console.log(client.responseText);
        CLIENT_ID = client.responseText;
    }
    client.send();
}