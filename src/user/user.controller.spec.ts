import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

describe('UserController', () => {
  let userController: UserController;
  const mockUserService = { create: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    userController = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should return user', async () => {
      const user = { id: 1 };
      jest.spyOn(mockUserService, 'create').mockReturnValue(user as any);

      const result = await userController.create(user as any);

      expect(result).toBe(user);
    });
  });
});
