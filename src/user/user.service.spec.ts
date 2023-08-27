import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return user with same id', async () => {
      const user = { id: 1 };
      jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);
      jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

      const result = await service.create(user as any);

      expect(result!.id).toEqual(user.id);
    });
  });

  describe('get', () => {
    it('should return users array', async () => {
      const user = { id: 1 };
      jest.spyOn(mockUserRepository, 'find').mockReturnValue([user]);

      const result = await service.get();

      expect(result!.length).toEqual(1);
    });
  });

  describe('getById', () => {
    it('should return user with same id when passed existing id', async () => {
      const userId = 1;
      const user = {
        id: userId,
      };
      const mockSelectQueryBuilder = {
        where: jest.fn(() => mockSelectQueryBuilder),
        addSelect: jest.fn(() => mockSelectQueryBuilder),
        leftJoinAndSelect: jest.fn(() => mockSelectQueryBuilder),
        getOne: jest.fn(() => user),
      };
      jest
        .spyOn(mockUserRepository, 'createQueryBuilder')
        .mockReturnValue(mockSelectQueryBuilder);

      const result = await service.getById(userId);

      expect(result.id).toEqual(user.id);
    });

    it('should throw NotFoundException when passed unknown id', async () => {
      const mockSelectQueryBuilder = {
        where: jest.fn(() => mockSelectQueryBuilder),
        addSelect: jest.fn(() => mockSelectQueryBuilder),
        leftJoinAndSelect: jest.fn(() => mockSelectQueryBuilder),
        getOne: jest.fn(() => null),
      };

      jest
        .spyOn(mockUserRepository, 'createQueryBuilder')
        .mockReturnValue(mockSelectQueryBuilder);

      await expect(service.getById(0)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return user when passed existing id', async () => {
      const userId = 1;
      const user = {
        id: userId,
      };
      const mockSelectQueryBuilder = {
        where: jest.fn(() => mockSelectQueryBuilder),
        addSelect: jest.fn(() => mockSelectQueryBuilder),
        leftJoinAndSelect: jest.fn(() => mockSelectQueryBuilder),
        getOne: jest.fn(() => user),
      };
      jest
        .spyOn(mockUserRepository, 'createQueryBuilder')
        .mockReturnValue(mockSelectQueryBuilder);
      jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

      const result = await service.update(userId, user as any);

      expect(result!.id).toEqual(user.id);
    });
  });

  describe('delete', () => {
    it('should always resolve', async () => {
      await expect(service.delete(1)).resolves.not.toThrow();
    });
  });
});
