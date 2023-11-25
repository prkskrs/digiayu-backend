import { RequestWithUser } from "../interfaces/request";
import { Request, Response } from "express";

const RequestValidator = (schema: any, path = "body") => {
  return (req: RequestWithUser | Request, res: Response, next) => {
    const { error } = schema
      .preferences({ convert: false, stripUnknown: true })
      .validate(req[path]);
    if (error === undefined) {
      next();
    } else {
      const { details } = error;
      console.log(details);
      let message = "";
      const [dataType, errorType] = details[0]?.type?.split(".");
      const limit = details[0]?.context?.limit;
      const fieldName =
        details[0]?.context.label.split("_").length === 1
          ? details[0]?.context.label
          : details[0]?.context.label.split("_").join(" ");
      switch (errorType) {
        case "required":
          message = `${fieldName} is required`;
          break;
        case "empty":
          message = `${fieldName} is not allowed to be empty`;
          break;
        case "base":
          message = `${fieldName} must be a ${dataType}`;
          break;
        case "min":
          message = `${fieldName} must be greater than or equal to ${limit}`;
          break;
        case "max":
          message = `${fieldName} must be lesser than or equal to ${limit}`;
          break;
        case "pattern":
          message = `${fieldName} does not match the required pattern`;
          break;
        default:
          message = details.map((i: any) => i.message).join(",");
      }
      res.status(400).json({ success: false, error: message });
    }
  };
};
export default RequestValidator;
