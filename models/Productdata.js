import mongoose from "mongoose";

const productdataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품 이름은 필수입니다."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "가격은 필수입니다."],
      min: [0, "가격은 0원 이상이어야 합니다."],
    },
    description: {
      type: String,
      required: [true, "상품 설명은 필수입니다."],
      trim: true,
    },
    tags: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
);

const Productdata = mongoose.model("Product", productdataSchema);

export default Productdata;
