import { IsEmail, IsString, MinLength } from 'class-validator'

export class SignUpDTO {
  @IsString()
  @MinLength(3)
  firstName: string

  @IsString()
  @MinLength(3)
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
