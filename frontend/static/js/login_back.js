function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential); // Decode the JWT token
    console.log("ID: " + data.sub);
    console.log('Full Name: ' + data.name);
    console.log('Given Name: ' + data.given_name);
    console.log('Family Name: ' + data.family_name);
    console.log("Image URL: " + data.picture);
    console.log("Email: " + data.email);

    // Save user data to localStorage
    localStorage.setItem('userID', data.sub);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userPicture', data.picture);

    // Redirect to the dashboard
    window.location.href = 'dashboard.html';
}

function loadGoogleAPI() {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
        console.log("Google API script loaded.");
        initializeGAPI();
    };
    document.head.appendChild(script);
}

function initializeGAPI() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: 'AIzaSyC-1lBC_d0ncmjh8JAL9FqDUDHIbKs1Ync',
            clientId: '756222510526-5uokglj1q1ed1k85aa8ijj4nffndcsmf.apps.googleusercontent.com',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
        }).then(() => {
            console.log("GAPI client initialized.");
            return gapi.auth2.getAuthInstance().signIn();
        }).then(() => {
            console.log("User signed in.");
            fetchEmails();
        }).catch(error => {
            console.error('Error initializing Google API client:', error);
        });
    });
}

function fetchEmails() {
    gapi.client.gmail.users.messages.list({
        userId: 'me',
        labelIds: ['INBOX'],
        q: 'subject:transaction'
    }).then(response => {
        const messages = response.result.messages || [];
        console.log("Fetched emails:", messages);

        if (messages.length > 0) {
            messages.forEach(message => {
                gapi.client.gmail.users.messages.get({
                    userId: 'me',
                    id: message.id
                }).then(email => {
                    console.log("Email details:", email);
                    // Process email data here
                }).catch(error => {
                    console.error('Error fetching email details:', error);
                });
            });
        } else {
            console.log("No transaction emails found.");
        }
    }).catch(error => {
        console.error('Error fetching emails:', error);
    });
}

function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: '756222510526-5uokglj1q1ed1k85aa8ijj4nffndcsmf.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large' }
    );

    google.accounts.id.prompt(); // Show One Tap dialog
}

// Ensure Google Sign-In initializes after the DOM loads
window.onload = initializeGoogleSignIn;