import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Users } from 'db/entitis/Users';

@Module({
  imports: [MikroOrmModule.forFeature([Users])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
