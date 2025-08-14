import { Module } from '@nestjs/common';
import { SubProjectsService } from 'src/modules/subProjects/subProjects.service';
import { SubProjectsController } from 'src/modules/subProjects/subModules.controller';
import { SubProjects } from 'db/entitis/SubProjects';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([SubProjects])],
  controllers: [SubProjectsController],
  providers: [SubProjectsService],
})
export class SubProjectsModule {}
