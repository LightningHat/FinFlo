// Add this line at the beginning of the file to load the Google API client library
const script = document.createElement('script');
script.src = "https://apis.google.com/js/api.js";
document.head.appendChild(script);

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    console.log("ID: " + data.sub);
    console.log('Full Name: ' + data.name);
    console.log('Given Name: ' + data.given_name);
    console.log('Family Name: ' + data.family_name);
    console.log("Image URL: " + data.picture);
    console.log("Email: " + data.email);

    // Initialize the Google API client library
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: 'AIzaSyC-1lBC_d0ncmjh8JAL9FqDUDHIbKs1Ync',
            clientId: '756222510526-5uokglj1q1ed1k85aa8ijj4nffndcsmf.apps.googleusercontent.com',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
        }).then(() => {
            return gapi.auth2.getAuthInstance().signIn();
        }).then(() => {
            fetchEmails();
        }).catch(error => {
            console.error('Error initializing Google API client:', error);
        });
    });
}

function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: '756222510526-5uokglj1q1ed1k85aa8ijj4nffndcsmf.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt(); // also display the One Tap dialog
    google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large' }  // customization attributes
    );

    google.accounts.id.prompt(); // also display the One Tap dialog
}

// Ensure the function is called after the DOM is fully loaded
window.onload = initializeGoogleSignIn;

