const AWS = require("aws-sdk");
const sql = require("mssql");

(async () => {
  const sm = new AWS.SecretsManager({ region: "us-east-1" });
  const db = JSON.parse(
    (await sm.getSecretValue({ SecretId: "route_db_secrets" }).promise())
      .SecretString,
  );
  const pool = await sql.connect({
    user: db.username,
    password: db.password,
    server: db.host,
    port: db.port,
    database: db.dbInstanceIdentifier,
    options: { trustServerCertificate: true },
  });
  const rows = await pool.request().query(
    `SELECT PROJECT_ID, PROJECT_NUMBER, PROJECT_NAME, COLLECTOR_CODE, IS_LOCKED, IS_DOWNLOADED, IS_ACTIVE, KML_FILE_URL, GEOJSON_FILE_URL
     FROM dbo.PROJECT ORDER BY PROJECT_ID`,
  );
  console.table(rows.recordset);
  process.exit(0);
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
