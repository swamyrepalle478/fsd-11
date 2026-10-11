// WARNING: This permanently drops the library.books collection and library database.
// Run only after completing the experiment:
// mongosh "mongodb://localhost:27017" --file mongodb-cleanup.js

const library = db.getSiblingDB("library");

print("Drop books collection:");
printjson(library.books.drop());

print("Drop library database:");
printjson(library.dropDatabase());
