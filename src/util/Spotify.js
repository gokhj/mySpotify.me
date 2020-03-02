/* eslint-disable no-useless-concat */
const clientId = '382399453ebf45ec9a799e8561cbb8cd';
const redirectUri = 'https://myspotify.me/';
// const redirectUri = 'http://localhost:3000'; // Local
let accessToken;
let userId;

const Spotify = {

    // Get access token for top tracks & artists
    getAccessToken() {

        if (accessToken) {
            return accessToken;
        } else {
            const scopes = "user-top-read,playlist-modify-public"
            window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scopes}&redirect_uri=${redirectUri}`);
        }

    },

    assignAccessToken() {
        // Check if the access token is given by Spotify on the URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        // If the access token is given, then assign and return them && also writing to cookies
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            document.cookie = `accessToken=${accessToken}`; // Set cookies for the accessToken
            const date = new Date();
            document.cookie = `accessDate=${date.valueOf()}`; // Set cookies for the hour/date accessed (primitive values to make it easier for calculation)
            return accessToken;
        } else {
            return false; // return false to avoid multiple reloads on the page. --> check app.js constructor
        }

    },

    /* 
     * @param limit can be between 1 to 50
     * @param offset getting the next set of entities, 0 gets the first
     * @param time_range, long_term = several years, medium_term = 6 months, short_term = 4 weeks 
    */

    getArtists(time_range, limit=50) {
        if(!time_range) {
            time_range = "long_term";
        }
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${time_range}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
                return jsonResponse.items.map(artist => ({
                    id: artist.id,
                    name: artist.name,
                    image: artist.images,
                    link: artist.external_urls.spotify,
                    genres: artist.genres
                }))
        })

    },

    getTracks(time_range, limit=50) {
        if (!time_range) {
            time_range = "long_term";
        }
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.items.map(track => ({
                id: track.id,
                name: track.name,
                image: track.album.images,
                link: track.external_urls.spotify,
                artists: track.artists,
                uri: track.uri
            }));
        })

    },

    // check if the user is already signed in
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

    // get user's ID and profile picture {currently not in use}
    getId() {
        return fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse;
        })

    },

    // save ID as a variable
    makeId(id) {
        userId = id;
    },

    // when logout button clicked, the cookie is being removed
    deleteCookie() {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },

    // check if the cookie exists, designed to check from other files, needed a boolean return only
    checkExists() {
        if(accessToken) {
            return true;
        } else {
            return false;
        }
    },

    // Create a playlist out of top Spotify songs
    savePlaylist(trackUris, time_range, recommendation) {

        let name;

        if(recommendation) {

            // Assign name variable
            if (time_range === "short_term") {
                name = 'mySpotify.me recommendations for the last month';
            } else if (time_range === "medium_term") {
                name = 'mySpotify.me recommendations for the last 6 months';
            } else if (time_range === "long_term") {
                name = 'mySpotify.me recommendations for all time history';
            } else {
                return false;
            }

        } else {

            const date = new Date();
            let arranged_date = "";
            arranged_date += date.getDate() + "/";
            arranged_date += (date.getMonth()+1) + "/";
            arranged_date += date.getFullYear();

            // Assign name variable
            if (time_range === "short_term") {
                name = `My top songs in last month - ${arranged_date}`;
            } else if (time_range === "medium_term") {
                name = `My top songs in the last 6 months - ${arranged_date}`;
            } else if (time_range === "long_term") {
                name = `My all time top songs - ${arranged_date}`;
            } else {
                return false;
            }
        }

        const headers = { Authorization: `Bearer ${accessToken}` };

        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                const playlistLink = jsonResponse.external_urls.spotify;
                if(jsonResponse) {
                    alert(
                    `Playlist was hopefully created on your account!\n${name}\n${playlistLink}`
                    );
                }
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                });
            });
        });
    },

    getRecommendations(artists, tracks) {

        // final objects for POST request to spotify
        let seedArtists = ""; // 1 seed artist
        let seedTracks = ""; // 3 seed tracks
        let seedGenre = ""; // 1 seed genre (the top one out of the top 5 artists)

        // Getting the genre details from the artist object
        let genreCollection = {}
        let counter = 0
        artists.forEach(artist => {
            if(counter === 0) {
                seedArtists = artist.id;
            }
            artist.genres.forEach(genre => {

                if (genreCollection[genre]) {
                    genreCollection[genre]++;
                } else {
                    genreCollection[genre] = 1
                }

            });
        });

        // sorting genre collection by its values
        let sortedGenre = [], obj = genreCollection;
        for(let key in obj) {
            sortedGenre.push([key, obj[key]]);
        }
        sortedGenre.sort(function(a, b){
            return a[1] - b[1]
        });

        // getting the top genre

        seedGenre = sortedGenre[sortedGenre.length-1][0];

        counter = 0;
        let trackArtists = [];
        tracks.forEach(track => {
            if(counter < 3) {
                let trackArtist = track.artists[0].name;
                // preventing duplicate artist information for the tracks
                // for better recommendations
                if (!(trackArtists.indexOf(trackArtist) > -1)) {
                    trackArtists.push(trackArtist);
                    seedTracks += track.id + "%2C";
                    counter++;
                }
            }
        });
        
        return fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${seedArtists}&seed_genres=${seedGenre}&seed_tracks=${seedTracks}&limit=50`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse;
        })

    },
}

const token = Spotify.checkCookies(); // initial variable to check cookie
if (token) {
    accessToken = token; // if found assign it
}


export default Spotify;