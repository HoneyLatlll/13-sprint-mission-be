import prisma from "../lib/prisma.js";

export const getProducts= async(req,res)=>{
  try{
    const{
      offset=0,
      limit=10,
      sort,
      keyword
    }=req.query;
  }
}