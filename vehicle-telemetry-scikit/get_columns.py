import pandas as pd
cols = pd.read_csv('data_for_fleet_dna_delivery_vans.csv', nrows=0).columns.tolist()
with open('columns.txt', 'w') as f:
    for col in cols:
        f.write(col + '\n')
