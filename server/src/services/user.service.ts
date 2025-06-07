import { UserRepository } from '../repositories/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }
}
