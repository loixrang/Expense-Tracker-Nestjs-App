import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { transactions } from '../db/schema/transaction.schema.js';
import { eq, sql } from 'drizzle-orm';
import { categories } from '../db/schema/category.schema.js';

@Injectable()
export class ReportsRepository {
  constructor (private readonly database: DbService) {}
  async summary(userId: number) {
    const [summary] = await this.database.db
    .select({
      totalIncome: sql<string>`
        COALESCE(
          SUM(${transactions.amount})
          FILTER (WHERE ${categories.type} = 'income'),
          0
        )::text
      `,

      totalExpenses: sql<string>`
        COALESCE(
          SUM(${transactions.amount})
          FILTER (WHERE ${categories.type} = 'expense'),
          0
        )::text
      `,

      balance: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${categories.type} = 'income'
                THEN ${transactions.amount}
              ELSE -${transactions.amount}
            END
          ),
          0
        )::text
      `,
    })
    .from(transactions)
    .innerJoin(
      categories,
      eq(transactions.categoryId, categories.id),
    )
    .where(eq(transactions.userId, userId));

  return summary;
  }
}
