# Tech Talks

![tech-talks-demo](https://user-images.githubusercontent.com/2905455/56312865-fedae580-6105-11e9-9079-9bbc27293a7e.gif)

Tech Talks is a place to discover and watch conference talks about web development. I've collected thousands of talks from a number of JavaScript conferences since 2017 by looking up their associated conference playlists on YouTube.

This is a work-in-progress, but I'd thought I'd build in public and share what I have right now. Others have built similar apps as well; be sure to check out [Related Projects](#related-projects) below.

## Setup and Development

Clone the git repository and navigate to the `tech-talks` folder.

```
git clone git@github.com:andrewh0/tech-talks.git
cd tech-talks
```

This app uses TypeScript for both the frontend and backend, so you'll notice a `package.json` in both the `client` and `root` directories.

Install dependencies for both the client and the server.

```
yarn
cd client && yarn
```

### Setting up Algolia

This app uses [Algolia](https://www.algolia.com/) for search. You'll need an Algolia account to start managing your search index. Be sure to add your Algolia API credentials to `.env`. The `createAlgoliaIndex.ts` script in the `scripts` folder may be helpful here for seeding the index.

### Obtaining YouTube API credentials

The YouTube API is used to retrieve video and playlist data. You'll need to enable the YouTube API via the [Google Developer Console](https://console.developers.google.com) and get your API credentials there. Add them to the `.env` file in the root directory.

### Running the app locally

Start the Express server with the following command.

```
yarn start
```

Navigate to the `client` directory to start the client server.

```
cd client
yarn start
```

Go to `localhost:3000` in your browser.

### Prettier

From the client and root folders, you can run the following command to format the client and server code, respectively.

```
yarn run prettier
```

## Deployment

This app's frontend is hosted on Netlify. It also uses many of Heroku's add-ons.
Remember to add your API credentials to the production environment.

This app uses:

- Heroku Scheduler to update video view counts and to update the Algolia search index.
- Papertrail for logs

## Built with

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Emotion](https://emotion.sh/docs/introduction/)
- [styled-system](https://styled-system.com/)
- [reach-router](https://reach.tech/)
- [Firebase Cloud Firestore](https://firebase.google.com/products/firestore/)
- [Algolia Search](https://www.algolia.com/)
- [Postgres](https://www.postgresql.org/)
- [Heroku](https://heroku.com/)

## Credentials

This app connects with some external services to get relevant data. You'll need to grab API Keys from them and add them to your `.env` file in the root directory.

- [Firebase](https://console.firebase.google.com/)
- [Algolia](https://www.algolia.com/manage/applications)
- [YouTube](https://console.cloud.google.com/apis/library/youtube.googleapis.com/)

## Related Projects and Resources

- https://confs.tech
- https://awesometalks.party
- https://highlight.app
- https://www.reactjsvideos.com
- https://eventil.com/talks
- https://www.confreaks.com

## Contributing

Contributions of any kind are welcome! Thank you 🙏
