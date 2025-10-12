import app from './app';
import { testDatabaseConnection } from './config/database';

const port = process.env.PORT || 4000;

const bootstrap = async (): Promise<void> => {
  await testDatabaseConnection();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

void bootstrap();
