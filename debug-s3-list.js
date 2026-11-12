const AWS = require("aws-sdk");

(async () => {
  const sm = new AWS.SecretsManager({ region: "us-east-1" });
  const secrets = JSON.parse(
    (await sm.getSecretValue({ SecretId: "route_secrets" }).promise())
      .SecretString,
  );
  console.log("secret keys:", Object.keys(secrets).join(", "));
  const s3 = new AWS.S3({
    accessKeyId: secrets.S3_BUCKET_ACCESSKEY_ID,
    secretAccessKey: secrets.S3_BUCKET_SECRET_ACCESS_KEY_ID,
    region: secrets.S3_BUCKET_REGION,
  });
  const bucket = secrets.S3_BUCKET_ROOT_FOLDER;
  for (const prefix of ["T00001/", "T12121/", "T12144/"]) {
    try {
      const res = await s3
        .listObjectsV2({ Bucket: bucket, Prefix: prefix })
        .promise();
      console.log(`\n${prefix} -> ${res.Contents.length} objects`);
      res.Contents.forEach((o) => console.log("  ", o.Key));
    } catch (e) {
      console.log(prefix, "->", e.message);
    }
  }
  process.exit(0);
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
