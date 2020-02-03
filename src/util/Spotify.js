const clientId = '382399453ebf45ec9a799e8561cbb8cd';
const redirectUri = 'https://myspotify.me/';
let accessToken;

const Spotify = {

    // Getting access token for top tracks & artists
    getAccessToken() {

        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            return accessToken;
        } else {
            // user-top-read is the only scope needed
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=user-top-read&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }

    },

    /* 
     * @param limit can be between 1 to 50
     * @param offset getting the next set of entities, 0 gets the first
     * @param time_range, long_term = several years, medium_term = 6 months, short_term = 4 weeks 
    */

    getArtists() {

        const accessToken = Spotify.getAccessToken();

        return fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term', { // will add limit and time_range later
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
                return jsonResponse.items.map(artist => ({
                    name: artist.name
                }))
        })

    },

    getTracks() {

        const accessToken = Spotify.getAccessToken();

        return fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term', { // will add limit and time_range later
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.items.map(track => ({
                name: track.name
            }));
        })

    }

}

export default Spotify