import * as mongoose from 'mongoose';
import * as constants from '../constants';
export const databaseProviders = [
  {
    provide: constants.database.databaseConnection,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/nest'),
  },
];
