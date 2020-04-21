# docker-speedtest

![](https://i.imgur.com/cvfhIDH.png)

Docker setup consisting out of Grafana incl. a pre-configured dashboard, InfluxDB and a [speedtest.net CLI test](https://github.com/sindresorhus/speed-test) runner.

## Installation

1. Make sure you've installed all requirements
2. Clone this repository:

```shell
git clone https://github.com/frdmn/docker-speedtest
```

3. Create a copy of the sample `.env` file and adjust it at will:

```shell
cp .env.sample .env
```

4. Spin up the containers:

```shell
docker-compose up -d
```

## Configuration

You can make use of the following environment variables / configurations:

| Environment variable | Default value | Description
|----------------------|---------------|------------|
| `GRAFANA_PORT` | `3000` | Port to bind Grafana web interface on the host system |
| `INFLUXDB_DB` | `speedtest` | Database name to save speedtest results |
| `INFLUXDB_HOST` | `influxdb` | Host of InfluxDB (Only used when running in client mode - see below) |
| `INFLUXDB_PORT` | `8086` | Port of InfluxDB |
| `SPEEDTEST_HOST` | `local` | Display name of the client |
| `SPEEDTEST_NETWORK_NAME` | `not specified` | Name of the network this client was on during the test |
| `SPEEDTEST_NETWORK_TYPE` | `not specified` | Type of network this client was on (e.g. Wired, Wireless) |
| `SPEEDTEST_SPEEDTEST_INTERVAL` | `3600` | Interval/pause (in seconds) between speedtests |

## Usage

### Services

#### Start/create services

```shell
$ docker-compose up -d
Creating speedtest_influxdb_1  ... done
Creating speedtest_grafana_1   ... done
Creating speedtest_speedtest_1 ... done
```

#### Stop services

```shell
$ docker-compose stop
Stopping speedtest_influxdb_1  ... done
Stopping speedtest_grafana_1   ... done
Stopping speedtest_speedtest_1 ... done
```

#### Start services in client mode

By default, Grafana, Influx and Speedtest will all be started. In some cases, you may want to have a single database and store results from multiple clients. In this case, you should run the container in client mode, which basically just runs the speedtest service and uses the ${INFLUXDB_HOST} as a remote data store.

```shell
$ docker-compose -f docker-compose-client.yml up -d
Creating speedtest_speedtest_1 ... done
```

#### Upgrade services

```shell
$ docker-compose stop
$ docker-compose pull
$ docker-compose rm
$ docker-compose up -d
```

#### Check logs

```shell
$ docker-compose logs -f
```

```shell
$ docker-compose logs -f grafana
```

### Grafana

#### Dashboard

By default the dashboard shows all speedtest results. To filter for a specifc host, simply add a `and host = 'local'` statement in the `WHERE` clause of the SQL select.

Example (Download Time Serie):

```
SELECT mean("value") FROM "download" WHERE $timeFilter and host = 'local' GROUP BY time($interval) fill(null)
```

#### Administrative access

Access `http://${HOSTNAME}:${GRAFANA_PORT}` ([http://localhost:3000](`http://localhost:3000`) by default) and login using the following default credentials:

* Username: `admin`
* Password: `admin`

## Contributing

1. Fork it
2. Create your feature branch:

```shell
git checkout -b feature/my-new-feature
```

3. Commit your changes:

```shell
git commit -am 'Add some feature'
```

4. Push to the branch:

```shell
git push origin feature/my-new-feature
```

5. Submit a pull request

## Requirements / Dependencies

* Docker (incl. `docker-compose`)

## Version

1.1.0

## License

[MIT](LICENSE)
