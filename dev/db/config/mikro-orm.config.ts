import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';

// Entities
import { Projects } from '../entitis/Projects';
import { SubProjects } from '../entitis/SubProjects';
import { Translations } from '../entitis/Translations';

const config: MikroOrmModuleOptions = {
  driver: SqliteDriver,
  dbName: 'db.sqlite3',
  entities: [Projects, SubProjects, Translations],
  debug: true,
};

export default config;
