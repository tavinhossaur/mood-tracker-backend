declare interface Errors extends Error {
  type?: string;
  severity?: string;
  isAxiosError?: string;
  response: {
    status: number;
  };
  expiredAt: Date;
}
