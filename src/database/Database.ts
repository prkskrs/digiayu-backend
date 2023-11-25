import { MongoClient, Db, ObjectId, Filter } from "mongodb";

import {
  User,
  OTP,
  Doctor,
  Patient,
  Appointment,
  Diagnosis,
  Medicine,
  Cart,
  Category,
  SubCategory,
  Product,
  Offer,
  Order,
  Payment,
  UserWallet,
  Chat,
  ChatMessage,
} from "../interfaces/db";

console.log("Database Using Now : " + process.env.DATABASE_NAME);

const uri =
  process.env.NODE_ENV === "localhost"
    ? "mongodb://localhost:27017/" + process.env.DATABASE_NAME
    : `mongodb+srv://${process.env.DATABASE_USERNAME}:` +
      `${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}`;

const dbName = process.env.DATABASE_NAME;

export const client = new MongoClient(uri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export let db: Db;

interface DbSchema {
  user: User;
  doctor: Doctor;
  patient: Patient;
  otp: OTP;
  appointment: Appointment;
  diagnosis: Diagnosis;
  medicine: Medicine;
  cart: Cart;
  category: Category;
  sub_category: SubCategory;
  product: Product;
  offer: Offer;
  order: Order;
  payment: Payment;
  user_wallet: UserWallet;
  chat: Chat;
  chat_message: ChatMessage;
}

client
  .connect()
  .then(() => {
    console.log("Database connected...", process.env.NODE_ENV);
    db = client.db(dbName);
  })
  .catch((error) => {
    console.error(error);
  });

// disconnection logs
client.on("serverClosed", () => {
  console.log(`${process.env.NODE_ENV} Database disconnected`);

  db = null;
  client
    .connect()
    .then(() => {
      console.log("Database reconnected...", process.env.NODE_ENV);

      db = client.db(dbName);
    })
    .catch((error) => {
      console.error(error);
    });
});

type Projection<ProjectionType> = {
  [key in keyof ProjectionType]: 1;
};

export class Database {
  public getById = async <
    CollectionName extends keyof DbSchema,
    K extends Projection<Partial<DbSchema[CollectionName]>>,
    T extends Pick<DbSchema[CollectionName], keyof DbSchema[CollectionName]>,
  >(
    collectionName: CollectionName,
    id: string,
    projection?: K,
  ): Promise<T | null> => {
    try {
      const item = await db
        .collection(collectionName)
        .findOne<T>({ _id: new ObjectId(id) }, { projection });
      return item;
    } catch (error) {
      throw error;
    }
  };

  public updateById = async <T extends keyof DbSchema>(
    table: T,
    id: ObjectId,
    object: Partial<DbSchema[T]>,
  ) => {
    const item = await db
      .collection(table)
      .updateOne({ _id: id }, { $set: object });
    return item;
  };
  public updateArray = async <T extends keyof DbSchema>(
    table: T,
    id: ObjectId,
    object: any,
  ) => {
    const item = await db
      .collection(table)
      .updateMany({ _id: id }, { $push: object });
    return item;
  };
  public upsert = async <T extends keyof DbSchema>(
    table: T,
    query: Partial<DbSchema[T]>,
    object,
    arrayFilter?,
  ) => {
    const item = await db.collection(table).updateMany(
      query,
      { $set: object },
      {
        upsert: true,
        arrayFilters: arrayFilter,
      },
    );
    return item;
  };

  public add = async <T extends keyof DbSchema>(
    table: T,
    item: DbSchema[T],
  ) => {
    const addedItem = await db.collection(table).insertOne(item);
    return addedItem;
  };

  public delete = async <T extends keyof DbSchema>(
    table: T,
    query: Partial<DbSchema[T]>,
  ) => {
    const item = await db.collection(table).deleteOne(query);
    return item;
  };

  public updateByMultipleKeys = async <T extends keyof DbSchema>(
    table: T,
    selectorKeys,
    object,
  ) => {
    const item = await db
      .collection(table)
      .updateMany(selectorKeys, { $set: object });
    return item;
  };

  public get = async <
    CollectionName extends keyof DbSchema,
    K extends Projection<Partial<DbSchema[CollectionName]>>,
  >(
    collection: CollectionName,
    query: Filter<DbSchema[CollectionName]>,
    sortKey?: string,
    desc?: boolean,
    limit?: number,
    skip?: number,
    projection?: K,
  ): Promise<Array<
    Pick<DbSchema[CollectionName], keyof DbSchema[CollectionName]>
  > | null> => {
    try {
      let items;
      if (sortKey) {
        items = db
          .collection(collection)
          .find(query)
          .sort({ [sortKey]: desc ? -1 : 1 });
      } else {
        items = db.collection(collection).find(query).project(projection);
      }
      // collection.find({}).project({ a: 1 })                             // Create a projection of field a
      // collection.find({}).skip(1).limit(10)                          // Skip 1 and limit 10
      // collection.find({}).batchSize(5)                               // Set batchSize on cursor to 5
      // collection.find({}).filter({ a: 1 })                              // Set query on the cursor
      // collection.find({}).comment('add a comment')                   // Add a comment to the query, allowing to correlate queries
      // collection.find({}).addCursorFlag('tailable', true)            // Set cursor as tailable
      // collection.find({}).addCursorFlag('oplogReplay', true)         // Set cursor as oplogReplay
      // collection.find({}).addCursorFlag('noCursorTimeout', true)     // Set cursor as noCursorTimeout
      // collection.find({}).addCursorFlag('awaitData', true)           // Set cursor as awaitData
      // collection.find({}).addCursorFlag('exhaust', true)             // Set cursor as exhaust
      // collection.find({}).addCursorFlag('partial', true)             // Set cursor as partial
      // collection.find({}).addQueryModifier('$orderby', { a: 1 })        // Set $orderby {a:1}
      // collection.find({}).max(10)                                    // Set the cursor max
      // collection.find({}).maxTimeMS(1000)                            // Set the cursor maxTimeMS
      // collection.find({}).min(100)                                   // Set the cursor min
      // collection.find({}).returnKey(10)                              // Set the cursor returnKey
      // collection.find({}).setReadPreference(ReadPreference.PRIMARY)  // Set the cursor readPreference
      // collection.find({}).showRecordId(true)                         // Set the cursor showRecordId
      // collection.find({}).sort([['a', 1]])                           // Sets the sort order of the cursor query
      // collection.find({}).hint('a_1')                                // Set the cursor hint
      if (limit > 0) {
        items = items.limit(limit);
      }
      return await items.toArray();
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  public getCount = async <CollectionName extends keyof DbSchema>(
    collection: CollectionName,
    query: Filter<DbSchema[CollectionName]>,
  ) => {
    try {
      const count = await db.collection(collection).find(query).count();
      return count;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  public aggregate = async <CollectionName extends keyof DbSchema>(
    collection: CollectionName,
    pipeline,
  ) => {
    try {
      return await db.collection(collection).aggregate(pipeline).toArray();
    } catch (error) {
      console.log(error);

      throw error;
    }
  };
  public getOne = async <
    CollectionName extends keyof DbSchema,
    K extends Projection<Partial<DbSchema[CollectionName]>>,
  >(
    collection: CollectionName,
    query: Filter<DbSchema[CollectionName]>,

    projection?: K,
  ): Promise<Pick<
    DbSchema[CollectionName],
    keyof DbSchema[CollectionName]
  > | null> => {
    try {
      const item = db.collection(collection).findOne(query, {
        projection,
        sort: { _id: -1 },
      });
      return (await item) as Pick<
        DbSchema[CollectionName],
        keyof DbSchema[CollectionName]
      >;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };
}
