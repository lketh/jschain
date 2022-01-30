const jayson = require("jayson");
const { PORT } = require("../node/config");

const client = jayson.client.http({
  port: PORT,
});

module.exports = client;
