import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const accounts=sqliteTable('accounts',{userId:text('user_id').primaryKey(),data:text('data').notNull(),version:integer('version').notNull().default(0)});
export const usage=sqliteTable('ai_usage',{userId:text('user_id').notNull(),day:text('day').notNull(),count:integer('count').notNull().default(0)},t=>[primaryKey({columns:[t.userId,t.day]})]);
