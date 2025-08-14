import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { Translations } from 'db/entitis/Translations';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Translations])],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
