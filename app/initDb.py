import sqlite3
connection = sqlite3.connect("db.db")

cursor = connection.cursor()
cursor.execute('''
               
            CREATE TABLE IF NOT EXISTS Collections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                createdOn DATETIME DEFAULT CURRENT_TIMESTAMP,
                isFavorite BOOLEAN,
                color TEXT
                );
            ''')

cursor.execute('''
            CREATE TABLE IF NOT EXISTS Cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry TEXT,
                value TEXT,
                hint TEXT,
                createdOn DATETIME DEFAULT CURRENT_TIMESTAMP,
                collectionId INTEGER
               );
''')


connection.commit()
               