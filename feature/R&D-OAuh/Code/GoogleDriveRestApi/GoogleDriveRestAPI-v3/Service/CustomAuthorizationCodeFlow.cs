using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Requests;

namespace GoogleDriveRestAPI_v3.Service {
    public class CustomAuthorizationCodeFlow : GoogleAuthorizationCodeFlow
    {
        public CustomAuthorizationCodeFlow(Initializer initializer)
            : base(initializer) { }

        public override AuthorizationCodeRequestUrl
            CreateAuthorizationCodeRequest(string redirectUri)
        {
            return base.CreateAuthorizationCodeRequest(CustomAuthorizationBroker.RedirectUri);
        }
    }
}