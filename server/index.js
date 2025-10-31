import express from "express";
import cors from "cors";
import couchbase from "couchbase";

const app = express();
app.use(express.json());
app.use(cors());

let cluster, bucket, collection;

const connectToCouchbase = async () => {
  try {
    cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });

    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    collection = bucket.defaultCollection();

    console.log("✅ Connected to Couchbase");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
    process.exit(1);
  }
};

// connect on startup
await connectToCouchbase();

app.get("/", (req, res) => {
  res.send("✅ Punch API running...");
});

// save punch
app.post("/api/punch", async (req, res) => {
  try {
    const punch = {
      time: req.body.time,
      createdAt: new Date().toISOString(),
    };
    const key = `punch_${Date.now()}`;
    await collection.upsert(key, punch);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save punch" });
  }
});

// fetch punches
app.get("/api/punches", async (req, res) => {
  try {
    const query = `
      SELECT META().id, time, createdAt
      FROM \`${process.env.COUCHBASE_BUCKET}\`
      WHERE META().id LIKE "punch_%"
      ORDER BY createdAt DESC
      LIMIT 50;
    `;
    const result = await cluster.query(query);
    const punches = result.rows.map(row => ({
      id: row.id,
      time: row.time,
      createdAt: row.createdAt,
    }));
    res.send(punches);
  } catch (err) {
    console.error("❌ Query failed:", err);
    res.status(500).send({ error: "Failed to fetch punches" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
