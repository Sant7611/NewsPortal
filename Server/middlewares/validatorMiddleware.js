import { asyncErrorHandler } from "../util/asyncFunction.js";

export const validator = function (schema) {

    return asyncErrorHandler(async (req, res, next) => {

        const parseBody = await schema.parseAsync(req.body);

        req.body = parseBody;

        next();
    })
}