//// mongoConfigTesting.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Create inmemory database variable globally
// so both functions can use it.
let mongoServer;

exports.initializeMongoServer = async function() {
  // Start inmemory database
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to db via mongoose
  mongoose.connect(mongoUri);

  // If error connecting
  mongoose.connection.on("error", e => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });

  // This runs the callback function when "open"ed
  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
};

exports.closeMongoServer = async function() {
  mongoose.connection.once("close", () => {
    console.log("MongoDB successfully closed.");
  });
  await mongoose.connection.close();
  await mongoServer.stop();
}
