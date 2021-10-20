import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const typeOrmConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'freeboard',
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
  synchronize: true,
};
