import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service.js";
import { FindTransactionDto } from "./dto/find-transaction.dts.js";
import { transactions } from "../db/schema/transaction.schema.js";
import { and,eq } from "drizzle-orm";
import { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import { categories } from "../db/schema/category.schema.js";

@Injectable()
export class TransactionsRepository {
  constructor (private readonly database: DbService) {}
  async getALlTransactions(query: FindTransactionDto) {
      const typeQuery = await this.database.db.select({
        id: transactions.id,
        amount: transactions.amount,
        categories: categories.name,
        type: categories.type
      }).from(transactions).limit(query.limit).orderBy(transactions.id).offset((query.page - 1) * query.limit).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(query.type ? eq(categories.type, query.type) : undefined)

      return typeQuery ?? null
  }

  async getTransById(id: number, userId?: number) {
    const conditions = [eq(transactions.id, id)];

    if (userId !== undefined) {
    conditions.push(eq(transactions.userId, userId));
  }
    const [getById] = await this.database.db.select().from(transactions).where(and(...conditions))

    return getById ?? null
  }

  async createTransaction(createTransDto: CreateTransactionDto, user: boolean, id?:number) {
    if (id && user === true) {
      const created = await this.database.db.insert(transactions).values({
        amount: createTransDto.amount,
        userId: id
      }).returning()

      return created ?? null
    }
    const created = await this.database.db.insert(transactions).values({
      amount: createTransDto.amount,
    }).returning()

    return created ?? null
  }
}