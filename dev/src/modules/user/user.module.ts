import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Users } from 'db/entitis/Users';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
