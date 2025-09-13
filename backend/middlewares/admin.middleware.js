import ApiError from "../utils/ApiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";

const adminMiddleware = asyncHandler(async (req, _, next) => {
    if (req.user?.role !== "ADMIN") {
        throw new ApiError(403, "You are not authorized to perform this action");
    }
    next();
});

export default adminMiddleware;
