/* eslint-disable no-useless-concat */
const clientId = '382399453ebf45ec9a799e8561cbb8cd';
const redirectUri = 'https://myspotify.me/'
// const redirectUri = 'http://localhost:3000'; // Local
let accessToken;

const Spotify = {

    // Getting access token for top tracks & artists
    // If the accessToken already given then writes inside a cookie for future to avoid multiple calls
    getAccessToken() {

        if (accessToken) {
            document.cookie = `accessToken=${accessToken}`; // Setting cookies
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            document.cookie = `accessToken=${accessToken}`;
            return accessToken;
        } else {
            // user-top-read is the only scope needed
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-top-read&redirect_uri=${redirectUri}`;
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
        let tempCookie = document.cookie.match('(^|;) ?' + 'accessToken' + '=([^;]*)(;|$)');
        let cookie = tempCookie ? tempCookie[2] : false;
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
            console.log(jsonResponse)
            return jsonResponse;
        })

    },
    // when logout button clicked, the cookie is being removed
    deleteCookie() {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

}

let token = Spotify.checkCookies(); // initial variable to check cookie

if (token) {
    accessToken = token; // if found assign it
}

export default Spotify
