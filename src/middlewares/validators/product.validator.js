import z from "zod";

const schema = z.object({
  name: z.string().min(1).max(20),
  description: z.string().min(1).max(1000),
  price: z.coerce.number().positive(),
  //태그는 5개까지, 태그 문자열은 1자부터 10자까지 작성해야함 refine으로 태그 중복시 에러 태그가 한 개 일때 multer가 문자열로 넘겨줌
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
  existingImages: z
    .preprocess(
      (val) => (typeof val === "string" ? [val] : val),
      z.array(z.string()),
    )
    .optional(),
});

const validateCreateProduct = (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = new Error("입력값을 확인해주세요.");
    error.code = 400;
    //error.flatten()으로 zod에러 상세 이유 데이터 받음
    error.data = result.error.flatten();
    return next(error);
  }
  if (req.files.length < 1) {
    const error = new Error("이미지 파일을 1개 이상 등록해주세요");
    error.code = 400;
    return next(error);
  }
  req.body = result.data;
  next();
};

const validateUpdateProduct = (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const error = new Error("입력값을 확인해주세요.");
    error.code = 400;
    error.data = result.error.flatten();
    return next(error);
  }
  req.body = result.data;
  next();
};

export default { validateCreateProduct, validateUpdateProduct };
