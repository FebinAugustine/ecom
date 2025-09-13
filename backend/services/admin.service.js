import User from '../models/user.model.js';
import ApiError from '../utils/ApiErrors.js';

/**
 * Retrieves a paginated list of users, with an optional role filter, always excluding admins.
 * @param {object} options - Pagination options (page, limit).
 * @param {object} filter - Filtering options (e.g., { role: 'SELLER' }).
 * @returns {Promise<object>} A paginated list of users.
 */
export const getAllUsersService = async (options, filter) => {
  // 1. Start with a base query that ALWAYS excludes admins.
  const matchConditions = [{ role: { $ne: 'ADMIN' } }];

  // 2. If a specific role is provided, add it as a required condition.
  if (filter.role) {
    matchConditions.push({ role: filter.role });
  }

  // 3. Construct the final, unambiguous $match stage.
  const matchQuery = { $and: matchConditions };

  const pipeline = [
    { $match: matchQuery },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        forgotPasswordCode: 0,
        forgotPasswordCodeExpiry: 0,
        emailVerificationToken: 0,
        emailVerificationExpiry: 0
      }
    }
  ];

  const aggregate = User.aggregate(pipeline);
  const paginatedResult = await User.aggregatePaginate(aggregate, options);
  return paginatedResult;
};

/**
 * Updates the active status of a user account.
 * @param {string} userId - The ID of the user to update.
 * @param {boolean} isActive - The new active status.
 * @returns {Promise<object>} The updated user object.
 */
export const updateUserStatusService = async (userId, isActive) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.isActive = isActive;
    await user.save();

    return user;
};
