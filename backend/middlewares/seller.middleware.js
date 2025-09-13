import ApiError from "../utils/ApiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";

const sellerMiddleware = asyncHandler(async (req, _, next) => {
    if (req.user?.role !== "SELLER") {
        throw new ApiError(403, "You are not authorized to perform this action. Only sellers can access this route.");
    }
    next();
});

export default sellerMiddleware;
