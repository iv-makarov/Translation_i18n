import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import mikroOrmConfig from 'db/config/mikro-orm.config';

// Modules
import { ProjectsModule } from '../projects/projects.module';
import { SubProjectsModule } from '../subProjects/subProjects.module';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      schemaGenerator: {
        createForeignKeyConstraints: true,
      },
      forceEntityConstructor: true,
      ensureDatabase: true,
    }),
    ProjectsModule,
    SubProjectsModule,
    TranslationsModule,
  ],
})
export class AppModule {}
