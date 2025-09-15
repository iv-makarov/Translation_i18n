import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Translations } from 'db/entitis/Translations';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { TranslationsService } from 'src/modules/translations/translations.service';

@Controller('translations')
@UseGuards(JwtAuthGuard)
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  async getTranslationsAll() {
    return this.translationsService.getTranslationsAll();
  }

  @Get(':id')
  async getTranslationsByProjectId(@Param('id') id: string) {
    return this.translationsService.getTranslationsByProjectId(id);
  }

  @Post()
  async createTranslation(@Body() translation: Translations) {
    return this.translationsService.createTranslation(translation);
  }

  @Put(':id')
  async updateTranslation(
    @Param('id') id: string,
    @Body() translation: Translations,
  ) {
    return this.translationsService.updateTranslation(id, translation);
  }

  @Delete(':id')
  async deleteTranslation(@Param('id') id: string) {
    return this.translationsService.deleteTranslation(id);
  }

  @Put(':id/verified')
  async changeVerified(@Param('id') id: string, @Body() isVerified: boolean) {
    return this.translationsService.changeVerified(id, isVerified);
  }
}
