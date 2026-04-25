import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

DATABASE_URL = "postgresql://neondb_owner:npg_vdAzloUpb4Y9@ep-icy-night-aowm2te2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
MP_FILE = r"D:\bl\all-india-villages-master-list-excel\dataset\Rdir_2011_23_MADHYA_PRADESH.xls"

print("Reading MP Village Directory sheet...")
xl = pd.read_excel(MP_FILE, sheet_name='Village Directory', header=None, dtype=str)
xl.columns = ['state_code','state_name','district_code','district_name',
              'subdistrict_code','subdistrict_name','village_code','village_name']
xl = xl.iloc[1:].reset_index(drop=True)
for col in xl.columns:
    xl[col] = xl[col].astype(str).str.strip()

print(f"Total rows: {len(xl)}")

# Insert STATE
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()
state_rows = xl[xl['district_code'] == '000'].head(1)
if not state_rows.empty:
    row = state_rows.iloc[0]
    cur.execute("INSERT INTO states (code, name) VALUES (%s, %s) ON CONFLICT (code) DO NOTHING",
                (row['state_code'], row['state_name']))
    conn.commit()
    print(f"✓ State: {row['state_name']}")

# Insert DISTRICTS
district_rows = xl[(xl['district_code'] != '000') & (xl['subdistrict_code'] == '00000')]
for _, row in district_rows.iterrows():
    cur.execute("INSERT INTO districts (code, name, state_code) VALUES (%s, %s, %s) ON CONFLICT (code, state_code) DO NOTHING",
                (row['district_code'], row['district_name'], row['state_code']))
conn.commit()
print(f"✓ Districts: {len(district_rows)}")

# Insert SUB-DISTRICTS
subdistrict_rows = xl[(xl['subdistrict_code'] != '00000') & (xl['village_code'] == '000000')]
for _, row in subdistrict_rows.iterrows():
    cur.execute("INSERT INTO sub_districts (code, name, district_code, state_code) VALUES (%s, %s, %s, %s) ON CONFLICT (code, district_code, state_code) DO NOTHING",
                (row['subdistrict_code'], row['subdistrict_name'], row['district_code'], row['state_code']))
conn.commit()
print(f"✓ Sub-districts: {len(subdistrict_rows)}")
cur.close()
conn.close()

# Insert VILLAGES in batches
village_rows = xl[xl['village_code'] != '000000']
village_data = [
    (row['village_code'], row['village_name'],
     row['subdistrict_code'], row['district_code'], row['state_code'])
    for _, row in village_rows.iterrows()
]
print(f"Inserting {len(village_data)} villages...")

batch_size = 200
total = 0
for i in range(0, len(village_data), batch_size):
    batch = village_data[i:i+batch_size]
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        execute_values(cur, """
            INSERT INTO villages (code, name, sub_district_code, district_code, state_code)
            VALUES %s ON CONFLICT DO NOTHING
        """, batch)
        conn.commit()
        cur.close()
        conn.close()
        total += len(batch)
        if total % 5000 == 0:
            print(f"  Progress: {total}/{len(village_data)}")
    except Exception as e:
        print(f"  Error at {i}: {e}")

print(f"\n✅ DONE! Madhya Pradesh: {total} villages inserted!")