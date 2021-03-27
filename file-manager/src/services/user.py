from mysql import connector
from werkzeug.exceptions import BadRequest
import config

DATABASE_ENDPOINT = config.DATABASE_ENDPOINT
DATABASE_USERNAME = config.DATABASE_USERNAME
DATABASE_PASSWORD = config.DATABASE_PASSWORD

def create_user(username, email, password_hash):
    '''Creates a new user in the database'''

    db = connector.connect(
        host=DATABASE_ENDPOINT,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        database='users'
    )

    dbCursor = db.cursor()

    dbCursor = db.execute(
        "SELECT COUNT(*) FROM users WHERE username = '%s';",
        username
    )

    result = dbCursor.fetchall()

    if int(result) > 0:
        dbCursor().close
        db.close()
        raise BadRequest("An error has occurred. Please ensure your username is unique.")

    dbCursor = db.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %b);",
        username, email, password_hash 
    )

    db.commit()
    dbCursor.close()
    db.close()

    return