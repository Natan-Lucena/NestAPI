import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Authservice } from './auth.service';
import { AuthDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: Authservice) {}

  @Post('signup')
  signUp(@Body() dto: AuthDTO) {
    return this.authService.singUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  singIn(@Body() dto: AuthDTO) {
    return this.authService.signIn(dto);
  }
}
