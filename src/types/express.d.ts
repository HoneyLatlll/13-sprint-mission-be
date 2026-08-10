declare global {
  namespace Express {
    interface Request {
      validateQuery?: {
        page: number;
        pageSize: number;
        sort: "recent" | "favorite";
        keyword?: string | undefined;
      };
    }
  }
}

export {};
