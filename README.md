# Tech Talks

This is a work-in-progress, but I'd thought I'd build in public and share what I have so far!

## Development
You'll need to have Docker installed for development. After it is installed, clone this repo and navigate to the project directory.

```
git clone git@github.com:andrewh0/tech-talks.git
cd tech-talks
```

Running the following in the terminal sets you up with a cleanly seeded database and a server running on `localhost:3000`.

```
docker-compose up
```

You can stop the services with
```
docker-compose stop
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
Contributions of any kind are welcome!
