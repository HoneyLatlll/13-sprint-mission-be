import swaggerJSDoc from "swagger-jsdoc";

// openapi 3.0 스펙이라 OAS3Options 사용 (단, 내부에 [key: string]:any 가 있어서 필드 오타까지 잡아주지는 않음)
const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "판다마켓 API",
      version: "1.0.0",
      description: "판다마켓 중고마켓 백엔드 API 명세서",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT ?? 3001}`,
        description: "로컬 개발 서버",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "user@example.com" },
            nickname: { type: "string", example: "판다" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            authorId: { type: "integer", example: 1 },
            name: { type: "string", example: "아이패드 팝니다" },
            description: { type: "string", example: "거의 새 제품입니다." },
            price: { type: "integer", example: 500000 },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["전자기기"],
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["uploads/abcd1234_.png"],
            },
            likeCount: { type: "integer", example: 0 },
            isLiked: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "에러 메시지" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
