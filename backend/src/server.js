import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { startBookingStatusJob } from "./jobs/bookingStatus.job.js";
import { startRoomBookingStatusJob } from "./jobs/roomBookingStatus.job.js";
import { startIssueOverdueJob } from "./jobs/issueOverdue.job.js";
import { initializeCommsSocket } from "./modules/comms/socket/commsSocket.js";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const enableCronRaw = String(process.env.ENABLE_CRON || "").toLowerCase();
  const cronEnabled = !["false", "0", "no"].includes(enableCronRaw);
  console.log("ENABLE_CRON:", process.env.ENABLE_CRON, "=> cronEnabled:", cronEnabled);

  if (cronEnabled) {
    console.log("Cron jobs are enabled");
    startBookingStatusJob();
    startRoomBookingStatusJob();
    startIssueOverdueJob();
  } else {
    console.log("Cron jobs are disabled");
  }

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.set("io", io);
  initializeCommsSocket(io);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
