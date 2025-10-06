import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';

// Entities
import { NameSpace } from '../entitis/NameSpace';
import { Organization } from '../entitis/Organization';
import { PasswordResetToken } from '../entitis/PasswordResetToken';
import { Projects } from '../entitis/Projects';
import { Session } from '../entitis/Session';
import { Translations } from '../entitis/Translations';
import { Users } from '../entitis/Users';
import { WhiteUrl } from '../entitis/WhiteUrl';

const config: MikroOrmModuleOptions = {
  driver: SqliteDriver,
  dbName: 'db.sqlite3',
  entities: [
    Projects,
    Translations,
    PasswordResetToken,
    Session,
    NameSpace,
    WhiteUrl,
    Organization,
    Users,
  ],
  debug: true,
};

export default config;
