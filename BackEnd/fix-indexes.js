require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test");
    
    console.log("🔧 Dropping all indexes...");
    await User.collection.dropIndexes();
    console.log("✅ Indexes dropped");
    
    console.log("🔧 Deleting all users...");
    const result = await User.deleteMany({});
    console.log(`✅ Eliminados ${result.deletedCount} usuarios`);
    
    console.log("🔧 Recreating indexes...");
    await User.syncIndexes();
    console.log("✅ Indexes recreated");
    
    const remaining = await User.countDocuments();
    console.log(`✅ Usuarios restantes: ${remaining}`);
    
    // Ver índices
    const indexes = await User.collection.getIndexes();
    console.log("\n📊 Índices actuales:");
    console.log(JSON.stringify(indexes, null, 2));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixIndexes();