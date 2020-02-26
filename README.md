# mySpotify.me

This is a React.JS project where people can see their top songs & artists by logging in with their respective Spotify accounts. The user can also create playlists with their top tracks, including in the last month, over the previous 6 months and account lifetime.

It's a serverless app, meaning there is no backend, and it doesn't store any information, initiated with create-react-app by Facebook.

**To run:**
```
yarn install
yarn start
```

**Known Issues**
- Logout is not properly working at this point, clicking the logout button deletes the access token cookie stored on the browser, however, the user needs to go to Spotify's website and logout from there as well. This is the only way to login with other Spotify accounts at the moment. Logout link https://www.spotify.com/logout/

## Screenshots:

### Main page && the buttons are disabled until login

![Readme%20md/Untitled.png](https://i.imgur.com/fYpUQ6G.png)

### Getting all time artist info

![Readme%20md/Untitled%201.png](https://i.imgur.com/l3vmyyw.png)

### Mobile version of the app

![Readme%20md/Untitled%202.png](https://i.imgur.com/fvSa21E.png)

### Displaying track information && save as a playlist button

![Readme%20md/Untitled%203.png](https://i.imgur.com/AD5rEoH.png)

### Created playlist on Spotify

![Readme%20md/Untitled%204.png](https://i.imgur.com/Y7oajtU.png)