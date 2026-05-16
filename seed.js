import mongoose from "mongoose";
import dotenv from "dotenv";
import Productdata from "./models/Productdata.js";

dotenv.config();

const seedData = [
  { name: "지갑", price: 10000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 11000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 12000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 13000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 14000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 15000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 16000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 17000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 1800, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
  { name: "지갑", price: 19000, description: "지갑임 ㅇㅇ", tags: ["가죽"] },
];

async function seed() {
  console.log(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB연결 성공");

  await Productdata.deleteMany({});
  console.log("기존 데이터 삭제 완료");

  await Productdata.insertMany(seedData);
  console.log("시드데이터 삽입 완료");

  await mongoose.disconnect();
  console.log("DB연결 종료");
}

seed();
