# beach-volleyball-alerts
Slack bot for [Manly beach volleyball](http://www.beachvolleyball.com.au/)

## Purpose of the app

Sends slack notifications when
* Some one has withdrawn from the existing full squad.
* New squads are added.

## Requirements

* Uses aws lambda for compute, scheduled every 5 min.
* Uses aws s3 to maintain state between each run.

## Local

Need to fill in the proper credentials in `./config.json` using `./config.example.json`
```
npm run start:dev
```

## Tests

```
npm run test
```

```
npm run test:watch
```
