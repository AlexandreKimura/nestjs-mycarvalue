import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: users.length, email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asda@test.com', '1234');

    expect(user.password).not.toEqual('1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup('tests@test.com', '1234');

    await expect(service.signup('tests@test.com', '1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Throws if sign in is called with an unused email', async () => {
    await expect(service.signin('test@test.com', '1234')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', '123411');

    await expect(service.signin('test@test.com', '1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Returns a user is correct password is provided', async () => {
    await service.signup('test@test.com', '1234');

    const user = await service.signin('test@test.com', '1234');
    expect(user).toBeDefined();
  });
});
