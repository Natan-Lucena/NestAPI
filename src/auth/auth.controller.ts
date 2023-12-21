import { Controller, Post } from '@nestjs/common';
import { Authservice } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: Authservice) {}
  @Post('signup')
  signUp() {
    return 'im signed up';
  }
  @Post('signin')
  singIn() {
    return 'im signed in';
  }
}
