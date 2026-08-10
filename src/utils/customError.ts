export class CustomError extends Error {
  code: number;
  //data를 호출하는 곳마다 타입이 달라서 unknown사용 사용하는 곳에서 타입 좁히기
  data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.code = code;
    this.data = data;
  }
}
