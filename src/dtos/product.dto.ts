import z from "zod";
import { schema } from "../middlewares/validators/product.validator";

//zod 스키마가 검증에 성공했을 때 나오는 데이터의 타입을 z.infer로 뽑아내 항상 schema와 동기화 되도록 만듦
export type ProductBodyDto = z.infer<typeof schema>;
