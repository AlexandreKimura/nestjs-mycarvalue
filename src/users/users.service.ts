import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) { }

  create(email: string, password: string) {
    const user = this.repository.create({ email, password });

    return this.repository.save(user);
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  find(email: string) {
    return this.repository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const userExists = await this.repository.findOneBy({ id });
    if (!userExists) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(userExists, attrs);

    return this.repository.save(userExists);
  }

  async remove(id: number) {
    const userExists = await this.repository.findOneBy({ id });
    if (!userExists) {
      throw new NotFoundException('User not found!');
    }

    return this.repository.remove(userExists);
  }
}
