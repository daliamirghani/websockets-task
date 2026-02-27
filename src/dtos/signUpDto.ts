import { IsString, IsIn } from 'class-validator';

export class SignUpDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  @IsIn(['admin', 'student'])
  role: 'admin' | 'student';
}