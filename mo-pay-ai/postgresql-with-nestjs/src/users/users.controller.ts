import { Body, Controller, Get, Post, UseGuards, Req, UnauthorizedException, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new UnauthorizedException();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
