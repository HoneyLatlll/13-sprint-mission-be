import { NextFunction, Request, Response } from "express";
import z from "zod";
import { CustomError } from "../../utils/customError.js";

const schema = z.object({
  name: z.string().min(1).max(20),
  description: z.string().min(1).max(1000),
  price: z.coerce.number().positive(),
  //태그는 5개까지, 태그 문자열은 1자부터 10자까지 작성해야함 refine으로 태그 중복시 에러 태그가 한 개 일때 multer가 문자열로 넘겨줌 이를 proprocess로 문자열이면 배열로 만드는것추가
  tags: z
    .preprocess(
      (val) => (typeof val === "string" ? [val] : val),
      z
        .array(z.string().min(1).max(10))
        .max(5)
        .refine((arr) => new Set(arr).size === arr.length, {
          message: "태그가 중복됐습니다.",
        }),
    )
    .optional(),
  //기존의 이미지 src 저장 배열
  existingImages: z
    .preprocess(
      (val) => (typeof val === "string" ? [val] : val),
      z.array(z.string()),
    )
    .optional(),
});

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(10),
  sort: z.enum(["recent", "favorite"]).default("recent"),
  keyword: z.string().optional(),
});

const validateCreateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new CustomError(
      "입력값을 확인해주세요",
      400,
      //zod v4에서 flatten()이 deprecated 됨 공식 대체 함수인 z.treeifyError() 사용
      z.treeifyError(result.error),
    );
  }

  //req.files 타입은 원래 배열/객체/undefined 세가지가 섞여있음 (multer가 여러 업로드 방식을 지원해서) 여기선 upload.array만 쓰니까 배열 형태로 as 단언
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length < 1) {
    throw new CustomError("이미지 파일을 1개 이상 등록해주세요", 400);
  }
  //zod검증 통과후 명시적으로 req.body를 교체
  req.body = result.data;
  next();
};

const validateUpdateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new CustomError(
      "입력값을 확인해주세요.",
      400,
      z.treeifyError(result.error),
    );
  }
  req.body = result.data;
  next();
};

const validateGetProductList = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = querySchema.safeParse(req.query);

  if (!result.success) {
    throw new CustomError(
      "쿼리 입력값을 확인해주세요.",
      400,
      z.treeifyError(result.error),
    );
  }
  req.validateQuery = result.data;
  next();
};

export default {
  validateCreateProduct,
  validateUpdateProduct,
  validateGetProductList,
};
