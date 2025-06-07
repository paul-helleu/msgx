import { UserRepository } from '../repositories/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  public async getUserById(id: number) {
    return this.userRepository.findById(id);
  }
}
