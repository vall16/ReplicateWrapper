"""
Migrazione per convertire i token da FLOAT a INT.
Eseguire con: python backend/migrate_to_int.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost/repli_db")
engine = create_engine(DATABASE_URL)

# Comandi per MySQL
alter_commands = [
    "ALTER TABLE users MODIFY COLUMN tokens INTEGER DEFAULT 0",
    "ALTER TABLE token_transactions MODIFY COLUMN amount INTEGER",
    "ALTER TABLE generated_images MODIFY COLUMN tokens_used INTEGER DEFAULT 0",
    "ALTER TABLE generated_videos MODIFY COLUMN tokens_used INTEGER DEFAULT 0",
]

with engine.connect() as conn:
    for cmd in alter_commands:
        try:
            conn.execute(text(cmd))
            print(f"Eseguito: {cmd}")
        except Exception as e:
            print(f"Errore su '{cmd}': {e}")
    conn.commit()

print("Migrazione completata!")
