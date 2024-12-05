const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://mrmongol:Ozusen18@localhost/biztime",
});

client.connect();

module.exports = client;


