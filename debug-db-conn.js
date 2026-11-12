const AWS = require("aws-sdk");
const net = require("net");

(async () => {
  const sm = new AWS.SecretsManager({ region: "us-east-1" });
  const db = JSON.parse(
    (await sm.getSecretValue({ SecretId: "route_db_secrets" }).promise())
      .SecretString,
  );
  console.log("host:", db.host, "| port:", db.port, "| db:", db.dbInstanceIdentifier);

  await new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(8000);
    socket.on("connect", () => {
      console.log("TCP CONNECT OK ->", `${db.host}:${db.port}`);
      socket.destroy();
      resolve();
    });
    socket.on("timeout", () => {
      console.log("TCP TIMEOUT ->", `${db.host}:${db.port}`);
      socket.destroy();
      resolve();
    });
    socket.on("error", (e) => {
      console.log("TCP ERROR ->", e.message);
      resolve();
    });
    socket.connect(db.port, db.host);
  });
  process.exit(0);
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
