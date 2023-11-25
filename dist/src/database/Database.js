"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
console.log("Database Using Now : " + process.env.DATABASE_NAME);
const uri = process.env.NODE_ENV === "localhost"
    ? "mongodb://localhost:27017/" + process.env.DATABASE_NAME
    : `mongodb+srv://${process.env.DATABASE_USERNAME}:` +
        `${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}`;
const dbName = process.env.DATABASE_NAME;
exports.client = new mongodb_1.MongoClient(uri, {
// useNewUrlParser: true,
// useUnifiedTopology: true,
});
exports.client
    .connect()
    .then(() => {
    console.log("Database connected...", process.env.NODE_ENV);
    exports.db = exports.client.db(dbName);
})
    .catch((error) => {
    console.error(error);
});
// disconnection logs
exports.client.on("serverClosed", () => {
    console.log(`${process.env.NODE_ENV} Database disconnected`);
    exports.db = null;
    exports.client
        .connect()
        .then(() => {
        console.log("Database reconnected...", process.env.NODE_ENV);
        exports.db = exports.client.db(dbName);
    })
        .catch((error) => {
        console.error(error);
    });
});
class Database {
    constructor() {
        this.getById = (collectionName, id, projection) => __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield exports.db
                    .collection(collectionName)
                    .findOne({ _id: new mongodb_1.ObjectId(id) }, { projection });
                return item;
            }
            catch (error) {
                throw error;
            }
        });
        this.updateById = (table, id, object) => __awaiter(this, void 0, void 0, function* () {
            const item = yield exports.db
                .collection(table)
                .updateOne({ _id: id }, { $set: object });
            return item;
        });
        this.updateArray = (table, id, object) => __awaiter(this, void 0, void 0, function* () {
            const item = yield exports.db
                .collection(table)
                .updateMany({ _id: id }, { $push: object });
            return item;
        });
        this.upsert = (table, query, object, arrayFilter) => __awaiter(this, void 0, void 0, function* () {
            const item = yield exports.db.collection(table).updateMany(query, { $set: object }, {
                upsert: true,
                arrayFilters: arrayFilter,
            });
            return item;
        });
        this.add = (table, item) => __awaiter(this, void 0, void 0, function* () {
            const addedItem = yield exports.db.collection(table).insertOne(item);
            return addedItem;
        });
        this.delete = (table, query) => __awaiter(this, void 0, void 0, function* () {
            const item = yield exports.db.collection(table).deleteOne(query);
            return item;
        });
        this.updateByMultipleKeys = (table, selectorKeys, object) => __awaiter(this, void 0, void 0, function* () {
            const item = yield exports.db
                .collection(table)
                .updateMany(selectorKeys, { $set: object });
            return item;
        });
        this.get = (collection, query, sortKey, desc, limit, skip, projection) => __awaiter(this, void 0, void 0, function* () {
            try {
                let items;
                if (sortKey) {
                    // @ts-ignore
                    items = exports.db
                        .collection(collection)
                        .find(query)
                        .sort({ [sortKey]: desc ? -1 : 1 });
                }
                else {
                    items = exports.db.collection(collection).find(query).project(projection);
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
                return yield items.toArray();
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
        this.getCount = (collection, query) => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const count = yield exports.db.collection(collection).find(query).count();
                return count;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
        this.aggregate = (collection, pipeline) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield exports.db.collection(collection).aggregate(pipeline).toArray();
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
        this.getOne = (collection, query, projection) => __awaiter(this, void 0, void 0, function* () {
            try {
                const item = exports.db.collection(collection).findOne(query, {
                    projection,
                    sort: { _id: -1 },
                });
                return (yield item);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map