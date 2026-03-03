import { jest } from '@jest/globals';

const findUserByEmailMock = jest.fn();
const createUserMock = jest.fn();

jest.unstable_mockModule('../../repositories/user.repository.js', () => ({
  findUserByEmail: findUserByEmailMock,
  createUser: createUserMock,
  findUserById: jest.fn(),
  findAllUsers: jest.fn(),
  updateUserById: jest.fn(),
  deleteUserById: jest.fn(),
  countUsers: jest.fn(),
}));

const authService = await import('../auth.service.js');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw 409 when email already exists', async () => {
      findUserByEmailMock.mockResolvedValue({ email: 'existing@test.com' });
      await expect(
        authService.register({
          name: 'Test',
          email: 'existing@test.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({ message: 'Email already registered', statusCode: 409 });
      expect(createUserMock).not.toHaveBeenCalled();
    });

    it('should return user and token when registration succeeds', async () => {
      findUserByEmailMock.mockResolvedValue(null);
      const savedUser = {
        _id: 'user1',
        name: 'Test',
        email: 'new@test.com',
        role: 'student',
      };
      createUserMock.mockResolvedValue(savedUser);

      const result = await authService.register({
        name: 'Test',
        email: 'new@test.com',
        password: 'password123',
      });

      expect(result.user).toMatchObject({ name: 'Test', email: 'new@test.com', role: 'student' });
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });
  });

  describe('login', () => {
    it('should throw 401 when user not found', async () => {
      findUserByEmailMock.mockResolvedValue(null);
      await expect(
        authService.login('unknown@test.com', 'password')
      ).rejects.toMatchObject({ message: 'Invalid email or password', statusCode: 401 });
    });

    it('should throw 401 when password does not match', async () => {
      const user = {
        _id: 'user1',
        email: 'test@test.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      findUserByEmailMock.mockResolvedValue(user);
      await expect(
        authService.login('test@test.com', 'wrong')
      ).rejects.toMatchObject({ message: 'Invalid email or password', statusCode: 401 });
    });
  });
});
