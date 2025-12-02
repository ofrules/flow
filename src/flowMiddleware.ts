import { NextFunction, Response } from "express";

import { FlowDefinition } from "./flowDefinition";
import { RequestData } from "./interfaces/requestData";

export function flowMiddleware<T extends object>(
  flowInstance: FlowDefinition<T>
) {
  // NOTE: req has to have `any` type, otherwise middleware can be used due to the type mismatch ...
  return (req: any, res: Response, next: NextFunction) => {
    const asyncStorageData = {
      request: new RequestData(req),
    };

    return flowInstance.init(asyncStorageData as T, () => next());
  };
}
