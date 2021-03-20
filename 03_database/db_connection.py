import os
import pg8000 #may require pip install

#input credentials
config = {
    "database": "de_pgdb",
    "user": "laYvibUU",
    "password": "XXXX",
    "host": "XXX",
    "port": 5432,
}

#nothing to define here for you
class PGWrapper:
    def __init__(self, config, autocommit=True):
        self.__autocommit = autocommit
        self.__config = config

    def __enter__(self):
        return self.connect()

    def __exit__(self, type, value, traceback):
        self.close()

    def connect(self):
        self.cnx = pg8000.connect(**self.__config)
        self.cnx.autocommit = self.__autocommit
        self.cursor = self.cnx.cursor()
        return self

    def close(self):
        try:
            self.cursor.close()
            self.cnx.close()
        except Exception:
            pass

    def query(self, sql, parameters=tuple()):
        self.cursor.execute(sql, parameters)
        results = self.cursor.fetchall()
        return results

    def query_as_list_of_dicts(self, sql, parameters=tuple()):
        self.cursor.execute(sql, parameters)
        results = []
        if self.cursor.description:
            cols = [h[0].decode("utf-8") for h in self.cursor.description]
            for row in self.cursor.fetchall():
                results.append({a: b for a, b in zip(cols, row)})
        return results

    def commit(self):
        self.cnx.commit()

    def rollback(self):
        self.cnx.rollback()




db_con = PGWrapper(config)
db_con.connect()
results = db_con.query_as_list_of_dicts("SELECT * FROM information_schema.schemata")
print(results)
