import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import couchbase from "couchbase";

// Environment variables
const COUCHBASE_CONNSTR = process.env.COUCHBASE_CONNSTR || "couchbase://localhost";
const COUCHBASE_USER = process.env.COUCHBASE_USER || "Administrator";
const COUCHBASE_PASS = process.env.COUCHBASE_PASS || "password";
const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET || "punches";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Couchbase
let clusterConn, bucket, collection;

async function initCouchbase() {
  try {
    clusterConn = await couchbase.connect(COUCHBASE_CONNSTR, {
      username: COUCHBASE_USER,
      password: COUCHBASE_PASS,
    });

    bucket = clusterConn.bucket(COUCHBASE_BUCKET);
    collection = bucket.defaultCollection();

    console.log("✅ Couchbase connected successfully");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
  }
}

await initCouchbase();

// ✅ POST /api/punch — Save a punch
app.post("/api/punch", async (req, res) => {
  const { note, time } = req.body;

  if (!time) {
    return res.status(400).json({ success: false, error: "Missing time" });
  }

  const id = `punch_${Date.now()}`;
  const recordedAt = new Date().toISOString();

  try {
    const punchData = { time, note, recordedAt };
    await collection.upsert(id, punchData);
    res.json({ success: true, recordedAt });
  } catch (err) {
    console.error("❌ Error saving punch:", err);
    res.status(500).json({ success: false, error: "Failed to save punch" });
  }
});

// ✅ GET /api/punches — Fetch all punches
app.get("/api/punches", async (req, res) => {
  try {
    const query = `SELECT p.* FROM \`${COUCHBASE_BUCKET}\` p ORDER BY META().id DESC LIMIT 50;`;
    const result = await clusterConn.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching punches:", err);
    res.status(500).json({ success: false, error: "Failed to fetch punches" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 30000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on port ${PORT}`);
});










  



// import express from "express";
// import cors from "cors";
// import couchbase from "couchbase";
// import path from "path";
// import { fileURLToPath } from "url";

// const app = express();
// app.use(express.json());
// app.use(cors()); // allow frontend requests

// let cluster, bucket, collection;

// const connectToCouchbase = async () => {
//   try {
//     cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
//       username: process.env.COUCHBASE_USERNAME,
//       password: process.env.COUCHBASE_PASSWORD,
//     });

//     bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
//     collection = bucket.defaultCollection();

//     console.log("✅ Couchbase connected successfully");
//   } catch (err) {
//     console.error("❌ Couchbase connection failed:", err);
//     process.exit(1);
//   }
// };

// const startServer = async () => {
//   await connectToCouchbase();

//   // ✅ Test route
//   app.get("/", (req, res) => {
//     res.send("✅ Punch API running...");
//   });

//   // ✅ Fetch punches
//   app.get("/api/punches", async (req, res) => {
//     try {
//       const query = `
//         SELECT META().id, time, createdAt
//         FROM \`${process.env.COUCHBASE_BUCKET}\`
//         WHERE META().id LIKE "punch_%"
//         ORDER BY createdAt DESC
//         LIMIT 50;
//       `;
//       const result = await cluster.query(query);
//       const punches = result.rows.map(row => ({
//         id: row.id,
//         time: row.time,
//         createdAt: row.createdAt,
//       }));
//       res.json(punches);
//     } catch (err) {
//       console.error("❌ Query failed:", err);
//       res.status(500).json({ error: "Failed to fetch punches" });
//     }
//   });

//   // ✅ Save punch
//   app.post("/api/punch", async (req, res) => {
//     try {
//       const punch = {
//         time: req.body.time,
//         createdAt: new Date().toISOString(),
//       };
//       const key = `punch_${Date.now()}`;
//       await collection.upsert(key, punch);
//       res.json({ success: true });
//     } catch (err) {
//       console.error("❌ Punch save failed:", err);
//       res.status(500).json({ error: "Failed to save punch" });
//     }
//   });

//   // ✅ Serve React frontend (optional if combined)
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   const clientBuildPath = path.join(__dirname, "../client/build");
//   app.use(express.static(clientBuildPath));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(clientBuildPath, "index.html"));
//   });

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
// };

// startServer();






























// import express from "express";
// import cors from "cors";
// import couchbase from "couchbase";
// import path from "path";
// import { fileURLToPath } from "url";

// const app = express();

// app.use(
//   cors({
//     origin: ["https://react-punch-app-1-ra32.onrender.com"], // ✅ your frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
// app.use(express.json());
// let cluster, bucket, collection;
// // ---------------------------
// // 1️⃣ Couchbase Connection
// // ---------------------------
// const connectToCouchbase = async () => {
//   try {
//     cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
//       username: process.env.COUCHBASE_USERNAME,
//       password: process.env.COUCHBASE_PASSWORD,
//     });

//     bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
//     collection = bucket.defaultCollection();

//     console.log("✅ Connected to Couchbase");
//   } catch (err) {
//     console.error("❌ Couchbase connection failed:", err);
//     process.exit(1);
//   }
// };

// // ---------------------------
// // 2️⃣ API Routes
// // ---------------------------
// app.get("/api", (req, res) => {
//   res.send("✅ Punch API running...");
// });

// // Save punch
// app.post("/api/punch", async (req, res) => {
//   try {
//     const punch = {
//       time: req.body.time,
//       createdAt: new Date().toISOString(),
//     };
//     const key = `punch_${Date.now()}`;
//     await collection.upsert(key, punch);
//     res.send({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: "Failed to save punch" });
//   }
// });

// // Fetch punches
// app.get("/api/punches", async (req, res) => {
//   try {
//     const query = `
//       SELECT META().id, time, createdAt
//       FROM \`${process.env.COUCHBASE_BUCKET}\`
//       WHERE META().id LIKE "punch_%"
//       ORDER BY createdAt DESC
//       LIMIT 50;
//     `;
//     const result = await cluster.query(query);
//     const punches = result.rows.map(row => ({
//       id: row.id,
//       time: row.time,
//       createdAt: row.createdAt,
//     }));
//     res.send(punches);
//   } catch (err) {
//     console.error("❌ Query failed:", err);
//     res.status(500).send({ error: "Failed to fetch punches" });
//   }
// });

// // ---------------------------
// // 3️⃣ Serve React Frontend
// // ---------------------------
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const clientBuildPath = path.join(__dirname, "../client/build");

// app.use(express.static(clientBuildPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(clientBuildPath, "index.html"));
// });

// // ---------------------------
// // 4️⃣ Start Server
// // ---------------------------
// const startServer = async () => {
//   await connectToCouchbase();
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server started on port ${PORT}`);
//   });
// };

// startServer();
