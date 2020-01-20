let dbPromise = idb.open("feed-store", 1, function (db) {
  if (!db.objectStoreNames.contains("posts")) {
    db.createObjectStore("posts", { keyPath: "id" });
  }
});

function writeData(store, data) {
  return dbPromise
    .then(function (db) {
      const tx = db.transaction(store, "readwrite");
      const st = tx.objectStore(store);

      st.put(data);

      return tx.complete;
    });
}

function readAllData(store) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(store, "readonly");
      var st = tx.objectStore(store);

      return st.getAll();
    });
}

function clearAllData(store) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(store, "readwrite");
      var st = tx.objectStore(store);

      st.clear();
      return tx.complete;
    });
}

function clearData(store, id) {
  dbPromise
    .then(function (db) {
      var tx = db.transaction(store, "readwrite");
      var st = tx.objectStore(store);

      st.delete(id);
      return tx.complete;
    })
    .then(function () {
      console.log("Item deleted!");
    })
}