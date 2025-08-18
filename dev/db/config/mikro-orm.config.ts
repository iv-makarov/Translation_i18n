import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';

// Entities
import { Projects } from '../entitis/Projects';
import { SubProjects } from '../entitis/SubProjects';
import { Translations } from '../entitis/Translations';
import { User } from '../entitis/User';
import { PasswordResetToken } from '../entitis/PasswordResetToken';
import { Session } from '../entitis/Session';

const config: MikroOrmModuleOptions = {
  driver: SqliteDriver,
  dbName: 'db.sqlite3',
  entities: [
    User,
    Projects,
    SubProjects,
    Translations,
    PasswordResetToken,
    Session,
  ],
  debug: true,
};

export default config;
