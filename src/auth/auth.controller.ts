import { Body, Controller, Post } from '@nestjs/common';
import { Authservice } from './auth.service';
import { AuthDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: Authservice) {}
  @Post('signup')
  signUp(@Body() dto: AuthDTO) {
    return this.authService.singUp(dto);
  }
  @Post('signin')
  singIn() {
    return this.authService.signIn;
  }
}
