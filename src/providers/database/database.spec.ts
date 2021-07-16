import { Test, TestingModule } from '@nestjs/testing';
import { databaseProviders } from './database.service';

describe('Db', () => {
  let provider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    // provider = module.get<Db>(Db);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
