const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend (React build)
app.use(express.static(path.join(__dirname, "../client/build")));

// Couchbase simulation or your DB code
let punches = [];

// API endpoints
app.get("/api/punches", (req, res) => {
  res.json(punches);
});

app.post("/api/punch", (req, res) => {
  const { time, message } = req.body;
  if (!time) return res.status(400).json({ error: "Time required" });

  const Punch = {
    time,
    note,
    createdAt: new Date().toISOString(),
  };
  
  punches.push( Punch );
  res.status(201).json({ success: true });
});



// Important for Render: use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



  



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
