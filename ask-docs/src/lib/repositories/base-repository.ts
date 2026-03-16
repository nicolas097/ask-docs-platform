// frontend/src/lib/repositories/base-repository.ts
import { Pool, PoolClient } from "../../../node_modules/@types/pg";

export abstract class BaseRepository {
protected pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected getExecutor(client?: PoolClient) {
    return client || this.pool;
  }
}

