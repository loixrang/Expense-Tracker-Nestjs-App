import { Injectable, OnModuleInit } from '@nestjs/common';
import { db, DB } from './client.js';
import { sql } from 'drizzle-orm';

@Injectable()
export class DbService implements OnModuleInit {
  readonly db: DB = db
  async onModuleInit() {
    await this.db.execute(sql`SELECT 1`)
  }
}
