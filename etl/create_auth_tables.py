import psycopg2

DATABASE_URL = "postgresql://neondb_owner:npg_vdAzloUpb4Y9@ep-icy-night-aowm2te2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS api_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        plan VARCHAR(20) DEFAULT 'free',
        is_admin BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES api_users(id),
        key_value VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        requests_today INTEGER DEFAULT 0,
        requests_total INTEGER DEFAULT 0,
        last_used TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS api_usage (
        id SERIAL PRIMARY KEY,
        api_key_id INTEGER REFERENCES api_keys(id),
        endpoint VARCHAR(255),
        called_at TIMESTAMP DEFAULT NOW()
    );
""")

conn.commit()
print("✅ Auth tables created successfully!")
cur.close()
conn.close()