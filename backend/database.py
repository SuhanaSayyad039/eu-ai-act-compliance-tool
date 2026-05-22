from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.getenv("NEO4J_URI", "neo4j://127.0.0.1:7687")
USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "password123")

driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

def get_session():
    return driver.session()

def close_driver():
    driver.close()

def test_connection():
    try:
        with driver.session() as session:
            result = session.run("RETURN 'Connected to Neo4j' AS message")
            record = result.single()
            print(record["message"])
            return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()