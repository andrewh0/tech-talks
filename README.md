# Tech Talks

![tech-talks-demo](https://user-images.githubusercontent.com/2905455/55691068-c6414c00-594e-11e9-8498-5143c962b671.gif)

Tech Talks is a place to discover and watch conference talks about web development. So far, I've collected about 3,700 talks from a number of JavaScript conferences since 2016 by looking up their associated conference playlists on YouTube.

This is a work-in-progress, but I'd thought I'd build in public and share what I have right now. Others have built similar apps as well (check out [Related Projects](#related-projects) below).

In the future, I'd love to be able to surface interesting content from lesser-known speakers and conferences.

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

### Deploying a Prisma Service

This app relies heavily on [Prisma](https://www.prisma.io/) to manage data. If you're unfamiliar, Prisma provides a GraphQL layer over your database, replacing a traditional ORM. You'll need a running Prisma server to continue. This project uses [Prisma's Heroku integration](https://www.prisma.io/blog/heroku-integration-homihof6eifi) to manage a Postgres database, but you can also opt to use a local database.

Once you have created a Prisma server and you have obtained your Prisma API credentials, you can add them to the `.env` folder in the root directory, using the `.env.example` file as a reference.

When your credentials have been added, run the following command to deploy your service to Prisma.
```
yarn prisma:deploy
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

This app is hosted on Heroku and uses many of its built-in features.
Remember to add your API credentials to the production environment.

This app uses:

- Heroku Scheduler to update video view counts and to update the Algolia search index.
- Papertrail for logs
- Postgres as its data store

## Built with
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Emotion](https://emotion.sh/docs/introduction/)
- [styled-system](https://styled-system.com/)
- [reach-router](https://reach.tech/)
- [Prisma](https://www.prisma.io/)
- [Algolia Search](https://www.algolia.com/)
- [Postgres](https://www.postgresql.org/)
- [Heroku](https://heroku.com/)

## Credentials
This app connects with some external services to get relevant data. You'll need to grab API Keys from them and add them to your `.env` file in the root directory.
- [Prisma](https://app.prisma.io/)
- [Algolia](https://www.algolia.com/manage/applications)
- [YouTube](https://console.cloud.google.com/apis/library/youtube.googleapis.com/)

## Related Projects
- https://awesometalks.party/ ([source](https://github.com/SaraVieira/awesome-talks))
- http://highlight.app/
- https://confs.tech/

## Contributing
Contributions of any kind are welcome! Thank you 🙏
