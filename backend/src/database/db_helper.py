import os

from dotenv import load_dotenv
from sqlalchemy import Enum, MetaData, create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Load DB URL from .env
DATABASE_URL = os.getenv("DATABASE_URI")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URI not set in environment variables.")

# SQLAlchemy engine and session factory
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Base declarative class
Base = declarative_base()
metadata = MetaData()


# -----------------------------
# Helper: List tables in DB
# -----------------------------
def list_tables():
    """Print all table names in the database."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Tables in DB:")
    for t in tables:
        print(f" - {t}")
    return tables


# -----------------------------
# Helper: List columns for a table
# -----------------------------
def list_columns(table_name):
    """Print all columns for a given table."""
    inspector = inspect(engine)
    columns = inspector.get_columns(table_name)
    print(f"Columns in {table_name}:")
    for col in columns:
        print(f" - {col['name']} ({col['type']}) nullable={col['nullable']}")


# -----------------------------
# Helper: List enums in DB
# -----------------------------
def list_enums():
    """Return a dict of enum types and their values from the database."""
    query = """
        SELECT n.nspname AS schema, t.typname AS enum_name,
               e.enumlabel AS enum_value
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        ORDER BY t.typname, e.enumsortorder;
    """
    enums = {}
    with engine.connect() as conn:
        result = conn.execute(text(query))
        for row in result.mappings():
            enums.setdefault(row["enum_name"], []).append(row["enum_value"])
            enums.setdefault(row["enum_name"], []).append(row["enum_value"])
    print("Enums in DB:")
    for name, values in enums.items():
        print(f" - {name}: {values}")
    return enums


# -----------------------------
# Helper: Generate SQLAlchemy Enum object
# -----------------------------
def get_sqlalchemy_enum(name):
    """Return a SQLAlchemy Enum object for a given enum type name."""
    enums = list_enums()
    if name in enums:
        return Enum(*enums[name], name=name, create_type=False)
    else:
        print(f"Enum {name} not found in DB")
        return None


# -----------------------------
# Helper: Quick test DB connection
# -----------------------------
def test_connection():
    """Test the database connection."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print("✅ Successfully connected to Supabase DB")
    except Exception as e:
        print("❌ Failed to connect to DB")
        print(e)


# -----------------------------
# Helper: Fetch table content
# -----------------------------
def fetch_table_content(table_name, limit=10):
    """Fetch all or first N rows from a table."""
    with engine.connect() as conn:
        query = text(f"SELECT * FROM {table_name} LIMIT :limit")
        result = conn.execute(query, {"limit": limit})
        rows = result.fetchall()
        columns = result.keys()
        data = [dict(zip(columns, row)) for row in rows]
    return data


# -----------------------------
# Helper: Migrate challenges to DB
# -----------------------------
def migrate_challenges(challenges):
    """
    Insert a list of challenges into the challenges table.
    Each challenge should be a dict with keys: id, title, points, category.
    description and frequency will be set to None.
    """
    insert_query = text("""
        INSERT INTO challenges (title, description, domain, frequency, points)
        VALUES (:title, :description, :domain, :frequency, :points)
    """)
    with engine.begin() as conn:
        for challenge in challenges:
            conn.execute(
                insert_query,
                {
                    "title": challenge["title"],
                    "description": None,
                    "domain": challenge["category"],
                    "frequency": None,
                    "points": challenge["points"]
                }
            )
    print(f"Inserted {len(challenges)} challenges into the database.")
    

# -----------------------------
# Helper: Clear table content
# -----------------------------
def clear_table(table_name):
    """Delete all rows from the specified table."""
    with engine.begin() as conn:
        conn.execute(text(f"DELETE FROM {table_name}"))
    print(f"All rows deleted from table '{table_name}'.")


# -----------------------------
# Helper: Get current DB name
# -----------------------------
def get_current_db_name():
    """Return the name of the current database connection."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT current_database();"))
        db_name = result.scalar()
    return db_name


if __name__ == "__main__":
    import json
    test_connection()
    # clear_table("onboarding_answers")
    # print(get_current_db_name())
    # tables = list_tables()
    # for table in tables:
    #     print(fetch_table_content(table))
    # print(fetch_table_content("onboarding_questions"))
    list_columns("onboarding_answers")
    # list_enums()

    # --- Load challenges from JSON and migrate them to DB ---
    # with open("./frontend/src/data/challenges.json", encoding="utf-8") as f:
    #     challenges = json.load(f)
    #     print(f"Loaded {len(challenges)} challenges from JSON. Migrating to DB...")
    #     migrate_challenges(challenges)
    #     print("Migration complete.")
