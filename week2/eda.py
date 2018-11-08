import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import style

class EDA():

    def __init__(self):
        df = self.load_data()
        df = self.processing_data(df)

        print(df)

    def load_data(self):

        df = pd.read_csv("input.csv")
        df1 = df[['Country',
                  'Region',
                  'Pop. Density (per sq. mi.)',
                  'Infant mortality (per 1000 births)',
                  'GDP ($ per capita) dollars']]
        return df1

    def processing_data(self, df):

        df = df[df != 'unknown']
        df = df.dropna()

        return df

if __name__ == "__main__":
    eda = EDA()



 # “Country”, “Region”, “Pop. Density (per sq. mi.)”,
 # “Infant mortality (per 1000 births)” and “GDP ($ per capita) dollars”
