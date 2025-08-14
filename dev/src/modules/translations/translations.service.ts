import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Translations } from 'db/entitis/Translations';

@Injectable()
export class TranslationsService {
  constructor(private readonly em: EntityManager) {}

  async getTranslationsAll() {
    return this.em.find(Translations, {});
  }

  async getTranslationsBySubProjectId(subProjectId: string) {
    return this.em.find(Translations, { subProject: subProjectId });
  }

  async createTranslation(translation: Translations) {
    return this.em.persistAndFlush(translation);
  }

  async updateTranslation(id: string, translation: Translations) {
    const translationFind = await this.em.findOne(Translations, { id });
    if (!translationFind) {
      throw new NotFoundException('Translation not found');
    }
    return this.em.persistAndFlush(translation);
  }

  async deleteTranslation(id: string) {
    const translation = await this.em.findOne(Translations, { id });
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }
    return this.em.removeAndFlush(translation);
  }

  async changeVerified(id: string, isVerified: boolean) {
    const translation = await this.em.findOne(Translations, { id });
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }
    translation.isVerified = isVerified;
    return this.em.persistAndFlush(translation);
  }
}
