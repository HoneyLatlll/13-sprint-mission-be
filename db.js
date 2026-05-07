import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("몽고DB 연결 성공");
  } catch (error) {
    console.error("DB연결 실패:", error.message);
    process.exit(1);
  }
}

export default connectDB;
