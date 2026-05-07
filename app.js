import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Productdata from "./models/Productdata.js";

dotenv.config();

const app = express();
app.use(express.json());
// const PORT = 3000; //이건 나중에 env파일로 이동할듯

connectDB();

app.get("/products", async (req, res) => {
  try {
    const { offset = 0, limit = 10, sort, keyword } = req.query;
    let query = {};
    if (keyword) {
      query = {
        //$or은 OR조건 뜻함 이름이나 설명 둘 중의 키워드
        //$regex는 문자열검색, $options:"i"는 검색옵션에서 대소문자 무시
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
    }
    let productsQuery = Productdata.find(query);
    //최신순 createdAt:-1 / 1은 반대
    if (sort === "recent") {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }
    //건너뛰기,갯수제한
    productsQuery = productsQuery.skip(Number(offset)).limit(Number(limit));

    const products = await productsQuery;
    //필요한 필드만 쏙 골라먹기
    const result = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      createdAt: product.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Productdata.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "없는 ID" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "잘못된 ID 형식" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = await Productdata.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const product = await Productdata.findByIdAndUpdate(
      req.params.id,
      req.body,
      //new:true 는 옛날 방식이고 아래 returnDocu..가 새로운방식
      { returnDocument: "after", runValidators: true },
    );
    if (!product) {
      return res.status(404).json({ message: "해당 ID없음" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Productdata.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "해당 ID없음" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`서버가 ${process.env.PORT}포트에서 실행 중`);
});
