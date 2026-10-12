import { seed } from "drizzle-seed";
import { db } from "./client.js";
import * as Schema from "./schema.js"

async function main() {
  await seed(db, Schema).refine((f) => ({
    user: {
      count: 25,
    },
    categories: {
      count: 50
    },
    transactions: {
      count: 100,
      columns: {
        amount: f.int({minValue: 1000, maxValue: 10000})
      }
    }
  }));
}

main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  console.log("Database seeded");
  process.exit(0)
})