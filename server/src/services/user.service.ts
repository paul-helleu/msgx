import { UserRepository } from '../repositories/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  public async getById(id: number) {
    return this.userRepository.findById(id);
  }

  public async searchUsers(search: string, excludeUserId: number) {
    const cleanSearch = search.trim().replace(/[%_]/g, '\\$&'); // escape % and _ for LIKE

    return await this.userRepository.searchWithExcludeUserId(
      cleanSearch,
      excludeUserId,
      10
    );
  }
}
