import { Connection } from 'mongoose';
import { UserSchema } from './user.schema';
import * as constants from '../constants';

export const userProviders = [
  {
    provide: constants.database.user_Model,
    useFactory: (connection: Connection) =>
      connection.model(constants.databaseSchemaNames.user, UserSchema),
    inject: [constants.database.databaseConnection],
  },
];
