export {};

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
      profile?: CustomerDoc
    }
  }
}