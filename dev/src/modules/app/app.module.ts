import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mikroOrmConfig from 'db/config/mikro-orm.config';

// Modules
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { TranslationsModule } from '../translations/translations.module';
import { UserModule } from '../user/user.module';

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
    AuthModule,
    UserModule,
    ProjectsModule,
    TranslationsModule,
  ],
})
export class AppModule {}
