import { Injectable } from '@nestjs/common';
import { Organization } from 'db/entitis/Organization';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class OrganizationService {
  constructor(private readonly em: EntityManager) {}

  async getOrganization() {
    return this.em.find(Organization, {});
  }
}
