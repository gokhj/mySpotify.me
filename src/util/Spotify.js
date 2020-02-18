/* eslint-disable no-useless-concat */
const clientId = '382399453ebf45ec9a799e8561cbb8cd';
const redirectUri = 'https://myspotify.me/'
// const redirectUri = 'http://localhost:3000'; // Local
let accessToken;

const Spotify = {

    // Getting access token for top tracks & artists
    getAccessToken() {

        if (accessToken) {
            return accessToken;
        } else {
            // user-top-read is the only scope needed
            window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-top-read&redirect_uri=${redirectUri}`);
        }

    },

    assignAccessToken() {
        // Checking if the access token is given by Spotify on the URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        // If the access token is given, then assign and return them && also writing to cookies
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            document.cookie = `accessToken=${accessToken}`; // Setting cookies for the accessToken
            const date = new Date();
            document.cookie = `accessDate=${date.valueOf()}`; // Setting cookies for the hour/date accessed (primitive values to make it easier for calculation)
            return accessToken;
        } else {
            return false; // returning false to avoid multiple reloads on the page. --> check app.js constructor
        }

    },

    /* 
     * @param limit can be between 1 to 50
     * @param offset getting the next set of entities, 0 gets the first
     * @param time_range, long_term = several years, medium_term = 6 months, short_term = 4 weeks 
    */

    getArtists(time_range) {
        if(time_range === "") {
            time_range = "long_term";
        }
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${time_range}`, { // will add limit and time_range later
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
                return jsonResponse.items.map(artist => ({
                    name: artist.name,
                    image: artist.images,
                    link: artist.external_urls.spotify,
                }))
        })

    },

    getTracks(time_range) {
        if (time_range === "") {
            time_range = "long_term";
        }
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${time_range}`, { // will add limit and time_range later
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.items.map(track => ({
                name: track.name,
                image: track.album.images,
                link: track.external_urls.spotify
            }));
        })

    },
    // checking if the user is already signed in
    checkCookies() {
        // Checking if accessToken already exists in the browser cookies
        const tempCookie = document.cookie.match('(^|;) ?' + 'accessToken' + '=([^;]*)(;|$)');
        const cookie = tempCookie ? tempCookie[2] : false;
        if(cookie) { // Checking time because Spotify only issues authorization for 60 minutes
            const accessedTime = document.cookie.match('(^|;) ?' + 'accessDate' + '=([^;]*)(;|$)'); // This is for testing purposes
            let d = new Date().valueOf();
            if((d-accessedTime[2]) > 3599999) {
                alert('Your authorization with Spotify is expired. Please login again.');
                return false;
            }
        }
        return cookie;
    },
    // getting user's ID and profile picture
    getId() {

        return fetch('https://api.spotify.com/v1/me', { // will add limit and time_range later
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse;
        })

    },
    // when logout button clicked, the cookie is being removed
    deleteCookie() {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    // checking if the cookie exists, designed to check from other files, needed a boolean return only
    checkExists() {
        if(accessToken) {
            return true;
        } else {
            return false;
        }
    }

}

const token = Spotify.checkCookies(); // initial variable to check cookie
if (token) {
    accessToken = token; // if found assign it
}


export default Spotify;