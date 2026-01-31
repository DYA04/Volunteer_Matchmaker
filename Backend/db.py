import psycopg2
import os


class DatabaseConnection():

    def __init__(self):
        db_name = "postgres"
        db_user = "postgres.okhhiixtvlqjfhtsmsxg"
        db_pass = "gaUAXFhQzP2TCFfg"
        db_host = "aws-0-us-west-2.pooler.supabase.com"
        db_port = 5432

        self.conn = psycopg2.connect(dbname=db_name, user=db_user, password=db_pass, host=db_host, port=db_port)

        if not self.conn:
            raise RuntimeError("Unable to connect to database")

    def execute_query(self, query):                 #To simplify the process for us and execute whatever random query for us
        curs = self.conn.cursor()
        curs.execute(query)
        result = curs.fetchall()

        if result:
            return result
        else:
            return "Error with query"
        
    def get_conn(self):
        return self.conn


def main():
    test = DatabaseConnection()
    query_result = test.execute_query("select * from public.test_table;")
    print(query_result)

if __name__ == "__main__":
    main()
