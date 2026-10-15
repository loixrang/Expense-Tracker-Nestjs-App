import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service.js";
import { FindTransactionDto } from "./dto/find-transaction.dts.js";
import { transactions } from "../db/schema/transaction.schema.js";
import { and,asc,eq, type SQL } from "drizzle-orm";
import { CreateTransactionDto } from "./dto/create-transaction.dto.js";
import { categories } from "../db/schema/category.schema.js";
import { UpdateTransactionDto } from "./dto/update-transaction.dto.js";

@Injectable()
export class TransactionsRepository {
  constructor (private readonly database: DbService) {}
  async getALlTransactions(query: FindTransactionDto, userId?: number) {
    const conditions: SQL[] = [];

    if (userId !== undefined) {
      conditions.push(eq(transactions.userId, userId));
    }
    if (query.type !== undefined) {
      conditions.push(eq(categories.type, query.type))
    }
    const offset = (query.page - 1) * query.limit

    const typeQuery = await this.database.db.select({
      id: transactions.id,
      amount: transactions.amount,
      categories: categories.name,
      type: categories.type
    }).from(transactions).innerJoin(categories, eq(transactions.categoryId, categories.id)).where(and(...conditions)).orderBy(asc(transactions.id)).limit(query.limit).offset(offset)

    return typeQuery
  }

  async getTransById(id: number, userId?: number) {
    const conditions = [eq(transactions.id, id)];

    if (userId !== undefined) {
      conditions.push(eq(transactions.userId, userId));
    }
    const [getById] = await this.database.db.select().from(transactions).where(and(...conditions))

    return getById
  }

  async createTransaction(createTransDto: CreateTransactionDto, id?:number) {
    const [newTransaction] = await this.database.db.insert(transactions).values({
      amount: createTransDto.amount,
      description: createTransDto.description,
      categoryId: createTransDto.categoryId,
      ...(id !== undefined && {userId: id})
    }).returning()

    return newTransaction
  }
  async update(validatedUpdate: UpdateTransactionDto, id: number, userId?: number) {
    const conditions = [eq(transactions.id, id)];

    if (userId !== undefined) {
      conditions.push(eq(transactions.userId, userId));
    }
    const [updateTrans] = await this.database.db.update(transactions).set({
      amount: validatedUpdate.amount,
      description: validatedUpdate.description
    }).where(and(...conditions)).returning()

    return updateTrans
  }
  async delete(id: number, userId?: number ) {
    const conditions = [eq(transactions.id, id)];

    if (userId !== undefined) {
      conditions.push(eq(transactions.userId, userId));
    }
    const [deleteTrans] = await this.database.db.delete(transactions).where(and(...conditions)).returning()

    return deleteTrans
  }
}