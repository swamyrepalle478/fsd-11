// Run with: mongosh "mongodb://localhost:27017" --file mongodb-library.js
// Run against an empty library.books collection. Cleanup is in mongodb-cleanup.js.

const library = db.getSiblingDB("library");
const collectionExists = library.getCollectionNames().includes("books");

if (collectionExists && library.books.countDocuments() > 0) {
    throw new Error("library.books is not empty. Use an empty collection to avoid duplicate sample records.");
}

if (!collectionExists) {
    print("Create collection:");
    printjson(library.createCollection("books"));
}

const books = library.books;

print("Insert sample documents:");
printjson(books.insertMany([
    { title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian", price: 12.99 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction", price: 14.99 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Classic", price: 10.99 },
    { title: "Moby Dick", author: "Herman Melville", year: 1851, genre: "Adventure", price: 9.99 },
    { title: "Brave New World", author: "Aldous Huxley", year: 1932, genre: "Dystopian", price: 11.99 }
]));

print("Collections:");
printjson(library.getCollectionNames());

print("All books sorted by year (ascending):");
printjson(books.find().sort({ year: 1 }).toArray());

print("First three books:");
printjson(books.find().limit(3).toArray());

print("Dystopian books:");
printjson(books.find({ genre: "Dystopian" }).toArray());

print("Create index on author:");
printjson(books.createIndex({ author: 1 }));

print("Indexes:");
printjson(books.getIndexes());

print("Book count by genre:");
printjson(books.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
]).toArray());

print("Average price by genre:");
printjson(books.aggregate([
    { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } },
    { $sort: { avgPrice: -1 } }
]).toArray());

print("Combined aggregation (year > 1900):");
printjson(books.aggregate([
    { $match: { year: { $gt: 1900 } } },
    {
        $group: {
            _id: "$genre",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" }
        }
    },
    { $sort: { count: -1 } },
    {
        $project: {
            genre: "$_id",
            count: 1,
            avgPrice: 1,
            _id: 0
        }
    }
]).toArray());

print("Dystopian books, newest first (limit 2):");
printjson(books.find({ genre: "Dystopian" }).sort({ year: -1 }).limit(2).toArray());
