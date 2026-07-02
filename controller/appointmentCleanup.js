const cron = require("node-cron");
const Appointment = require("../model/appointModel");

// Runs every hour at :00
// To run every minute (for testing), change "0 * * * *" to "* * * * *"
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    // Delete appointments that:
    // 1. Have a date set (accepted ones) AND that date has passed
    // 2. OR have been pending/declined for more than 7 days (cleanup)
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const result = await Appointment.deleteMany({
      $or: [
        // Accepted appointments whose date has passed
        {
          status: "accepted",
          date: { $lt: now }
        },
        // Stale pending or declined appointments older than 7 days
        {
          status: { $in: ["pending", "declined"] },
          createdAt: { $lt: sevenDaysAgo }
        }
      ]
    });

    if (result.deletedCount > 0) {
      console.log(`[Cron] Cleaned up ${result.deletedCount} expired appointment(s) at ${now.toISOString()}`);
    }

  } catch (err) {
    console.error("[Cron] Error cleaning up appointments:", err);
  }
});

console.log("[Cron] Appointment cleanup scheduler started");