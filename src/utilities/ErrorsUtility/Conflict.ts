import { HttpStatusCode } from "../../enums/Common";
import { BaseError } from "./BaseError";

export class Conflict extends BaseError {
  constructor(description = "is conflict") {
    super("CONFLICT", HttpStatusCode.CONFLICT, description, true);
  }
}
