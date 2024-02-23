import { HttpStatusCode } from "../../enums/Common";
import { BaseError } from "./BaseError";

export class NotFound extends BaseError {
  constructor(description = "bad request") {
    super("NOT_FOUND", HttpStatusCode.NOT_FOUND, description, true);
  }
}
