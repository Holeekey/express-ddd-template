import { MockEncryptor } from '../mocks/providers/mock-encryptor'
import { MockTokenGenerator } from '../mocks/providers/mock-token-generator'
import { MockCredentialRepository } from '../mocks/repositories/mock-credential.repository'
import { mockCredentials } from '../data/credentials-mock.data'
import { LoginService } from '../../src/auth/app/services/login/login.service'
import { AuthExceptionCode } from '../../src/auth/app/exceptions/codes/auth-exception-codes'

test('Invalid Password', () => {
  const credentialsRepo = new MockCredentialRepository(mockCredentials)
  const tokenGenerator = new MockTokenGenerator()
  const mockEncryptor = new MockEncryptor()

  new LoginService(tokenGenerator, mockEncryptor, credentialsRepo)
    .execute({
      email: 'lionelmessi10@gmail.com',
      password: 'password777',
    })
    .then((res) => {
      const err: any = res.getException()
      expect(err.code).toBe(AuthExceptionCode.INVALID_PASSWORD)
    })
})
