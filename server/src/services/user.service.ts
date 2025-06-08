import { logger } from '../config/logger.config';
import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/errors';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getByUsername(username: string) {
    try {
      return await this.userRepository.findByUsername(username);
    } catch (err) {
      logger.error(
        `getByUsername failed: ${username} - ${(err as Error).message}`
      );
      throw new ApiError(
        500,
        'Failed to retrieve user by username',
        'DB_FAILURE'
      );
    }
  }

  public async getById(id: number) {
    try {
      return await this.userRepository.findById(id);
    } catch (err) {
      logger.error(`getById failed: ${id} - ${(err as Error).message}`);
      throw new ApiError(500, 'Failed to retrieve user by ID', 'DB_FAILURE');
    }
  }

  public async searchUsers(search: string, excludeUserId: number) {
    try {
      const cleanSearch = search.trim().replace(/[%_]/g, '\\$&'); // escape % and _ for LIKE
      return await this.userRepository.searchWithExcludeUserId(
        cleanSearch,
        excludeUserId,
        10
      );
    } catch (err) {
      logger.error(`searchUsers failed: ${search} - ${(err as Error).message}`);
      throw new ApiError(500, 'Failed to search users', 'DB_FAILURE');
    }
  }
}
