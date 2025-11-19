import { config } from 'dotenv';
import path from 'path';

process.env.NODE_ENV = 'test';

const envPath = path.resolve(process.cwd(), '.env.test');
config({ path: envPath });
