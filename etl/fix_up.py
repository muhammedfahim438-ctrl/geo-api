import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

DATABASE_URL = "postgresql://neondb_owner:npg_vdAzloUpb4Y9@ep-icy-night-aowm2te2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
UP_FILE = r"D:\bl\all-india-villages-master-list-excel\dataset\Rdir_2011_09_UTTAR_PRADESH.ods"

print("Reading UP file...")
xl = pd.read_excel(UP_FILE, sheet_name=0, header=None, dtype=str, engine='odf')
xl.columns = ['state_code','state_name','district_code','district_name',
              'subdistrict_code','subdistrict_name','village_code','village_name']
xl = xl.iloc[1:].reset_index(drop=True)
for col in xl.columns:
    xl[col] = xl[col].astype(str).str.strip()

village_rows = xl[xl['village_code'] != '000000']
village_data = [
    (row['village_code'], row['village_name'],
     row['subdistrict_code'], row['district_code'], row['state_code'])
    for _, row in village_rows.iterrows()
]

print(f"Total villages: {len(village_data)}")
print("Resuming from where we stopped (ON CONFLICT DO NOTHING skips duplicates)...")

batch_size = 200
total = 0
errors = 0

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
        errors += 1
        print(f"  Batch error at {i}: {e}")
        try:
            conn.close()
        except:
            pass

print(f"\n✅ DONE! Processed: {total} | Errors: {errors}")