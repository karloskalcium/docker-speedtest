const execa = require("execa");
const Influx = require("influx");
const delay = require("delay");

const bitToMbps = bit => (bit / 1000 / 1000) * 8;

const log = (message, severity = "Info") =>
  console.log(`[${severity.toUpperCase()}][${new Date().toLocaleString()}] ${message}`);

const getSpeedMetrics = async () => {

  const subprocess = execa("speedtest", [
    "--accept-license",
    "--accept-gdpr",
    "-f",
    "json"
  ], { timeout: 60000});

  try {
    const { stdout } = await subprocess;
    const result = JSON.parse(stdout);
    return {
      upload: bitToMbps(result.upload.bandwidth),
      download: bitToMbps(result.download.bandwidth),
      ping: result.ping.latency
    }
  } catch (error) {
    console.log(error)
    return {
      upload: bitToMbps(0),
      download: bitToMbps(0),
      ping: 0
    }
  }
};

const pushToInflux = async (influx, metrics) => {
  const points = Object.entries(metrics).map(([measurement, value]) => ({
    measurement,
    tags: {
      host: process.env.SPEEDTEST_HOST,
      network_type: process.env.SPEEDTEST_NETWORK_TYPE,
      network_name: process.env.SPEEDTEST_NETWORK_NAME },
    fields: { value }
  }));

  await influx.writePoints(points);
};

(async () => {
  try {
    const influx = new Influx.InfluxDB({
      host: process.env.INFLUXDB_HOST,
      database: process.env.INFLUXDB_DB
    });

    while (true) {
      log("Starting speedtest...");
      const speedMetrics = await getSpeedMetrics();
      log(
        `Speedtest results - Download: ${speedMetrics.download}, Upload: ${speedMetrics.upload}, Ping: ${speedMetrics.ping}`
      );
      await pushToInflux(influx, speedMetrics);

      log(`Sleeping for ${process.env.SPEEDTEST_INTERVAL} seconds...`);
      await delay(process.env.SPEEDTEST_INTERVAL * 1000);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
