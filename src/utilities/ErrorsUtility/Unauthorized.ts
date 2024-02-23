import { HttpStatusCode } from "../../enums/Common";
import { BaseError } from "./BaseError";

export class Unauthorized extends BaseError {
  constructor(description = "Unauthorized") {
    super("Unauthorized", HttpStatusCode.UNAUTHORIZED, description, true);
  }
}
