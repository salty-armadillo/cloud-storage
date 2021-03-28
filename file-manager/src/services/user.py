from mysql import connector
from werkzeug.exceptions import BadRequest
import config

DATABASE_ENDPOINT = config.DATABASE_ENDPOINT
DATABASE_USERNAME = config.DATABASE_USERNAME
DATABASE_PASSWORD = config.DATABASE_PASSWORD

def add_user(username, email, password_hash):
    '''Creates a new user in the database'''

    db = connector.connect(
        host=DATABASE_ENDPOINT,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        database='cloudStorage'
    )

    dbCursor = db.cursor()

    dbCursor.execute(
        "SELECT COUNT(*) FROM users WHERE username = %s;",
        (username, )
    )

    result = dbCursor.fetchall()

    if int(result[0][0]) > 0:
        db.close()
        raise BadRequest("An error has occurred. Please ensure your username is unique.")

    dbCursor.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s);",
        (username, email, password_hash) 
    )

    db.commit()
    dbCursor.close()
    db.close()

    return