import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mikroOrmConfig from 'db/config/mikro-orm.config';

// Modules
// import { AuthModule } from '../auth/auth.module';
// import { UserModule } from '../profile/profile.module';
import { ProjectsModule } from '../projects/projects.module';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      schemaGenerator: {
        createForeignKeyConstraints: true,
      },
      forceEntityConstructor: true,
      ensureDatabase: true,
    }),
    ProjectsModule,
    TranslationsModule,
  ],
})
export class AppModule {}
