import { HttpStatusCode } from "enums/Common";
import { BaseError } from "./BaseError";

export class APIError extends BaseError {
  constructor(
    name: string = 'api error',
    httpCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
    description: string = "internal server error",
    isOperational: boolean = true
  ) {
    super(name, httpCode, description, isOperational);
  }
}
