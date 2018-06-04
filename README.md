# Tech Talks

![tech-talks](https://user-images.githubusercontent.com/2905455/40894060-b0cea240-675b-11e8-8b7c-61eb6cab3be0.gif)

This is a work-in-progress, but I'd thought I'd build in public and share what I have so far! This project began tool for myself to learn about new technologies, and I'm glad that others have had the same idea (see Related Projects below).

## Development
You'll need to have Docker installed for development. After it is installed, clone this repo and navigate to the project directory.

```
git clone git@github.com:andrewh0/tech-talks.git
cd tech-talks
```

The app expects a JSON file called `data.json` in the root directory, which is an array of video objects. Here is an example video object:
```
{
  "title": "Feross Aboukhadijeh: Write Perfect Code With Standard And ESLint - JSConf.Asia 2018",
  "description": "In this talk, you'll learn about code linting – how to use Standard and ESLint to catch programmer errors before they cause problems for your users.",
  "source": "youtube",
  "videoId": "kuHfMw8j4xk",
  "videoPublishedAt": 20180209,
  "eventName": "JSConf.Asia",
  "eventType": "conference",
  "eventLocation": "Singapore, Singapore",
  "thumbnailUrl": "https://i.ytimg.com/vi/kuHfMw8j4xk/mqdefault.jpg",
  "thumbnailHeight": 180,
  "thumbnailWidth": 320,
  "year": 2018,
  "views": 2990,
  "duration": 1475
}
```

Running the following in the terminal sets you up with a cleanly seeded database and a server running on `localhost:3000`.

```
docker-compose up
```

You can stop the services with
```
docker-compose stop
```

You can make the code look pretty via `prettier` with
```
yarn run pretty
```

## Built with
- [Algolia Search](https://www.algolia.com/)
- [styled-components](https://www.styled-components.com/)
- [Razzle.js](https://github.com/jaredpalmer/razzle/)
- [Sequelize](http://docs.sequelizejs.com/)
- [Postgres](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## Credentials
This app connects with some external services to get relevant data. You'll need to grab API Keys from them and add it to `config/secrets.js`
- [Twitter](https://apps.twitter.com/)
- [Algolia](https://www.algolia.com/manage/applications)
- [YouTube](https://console.cloud.google.com/apis/library/youtube.googleapis.com/)

## Related Projects
- https://awesometalks.party/ ([source](https://github.com/SaraVieira/awesome-talks))
- http://highlight.app/

## Contributing
Contributions of any kind are welcome! Thank you 🙏
