import pandas as pd
import numpy as np
import json
from statistics import mode, median, mean, stdev
import matplotlib.pyplot as plt
from matplotlib import style

class EDA():

    def __init__(self):
        df = self.load_data()
        df = self.processing_data(df)
        self.calculate_central_tendency_GDP(df)
        self.calculate_fivenumber(df)
        self.write_json_file(df)


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
        df = df.drop([193])

        return df

    def calculate_central_tendency_GDP(self, df):

        gdp = df['GDP ($ per capita) dollars'].tolist()

        new_gdp = []
        for country in gdp:
            country = int(country.replace(' dollars', ''))
            new_gdp.append(country)

        print(f"mode: {mode(new_gdp)}")
        print(f"median: {median(new_gdp)}")
        print(f"mean: {mean(new_gdp)}")
        print(f"std.dev: {stdev(new_gdp)}")

        x = df['Country'].tolist()
        y = new_gdp

        plt.hist(y, 5) # A bar chart
        plt.xlabel('Countrys')
        plt.ylabel('GDP in dollars')
        plt.xticks(rotation=90, fontsize=10)
        plt.show(block=True)

    def calculate_fivenumber(self, df):

        statistic_data = (df['Infant mortality (per 1000 births)'].tolist())
        statistic_data_new = []
        for stat in statistic_data:
            stat_new = stat.replace(',', '.')
            stat_new = float(stat_new)
            statistic_data_new.append(stat_new)

        minimum = min(statistic_data_new)   # minimum
        first_quartile = (np.percentile(statistic_data_new, 25))  # Q1
        mediaan = median(statistic_data_new) # median
        third_quartile = (np.percentile(statistic_data_new, 75))  # Q3
        maximum = max(statistic_data_new)

        five_summary = {"minimum": minimum,
                        "first_quartile": first_quartile,
                        "median": mediaan,
                        "third_quartile": third_quartile,
                        "maximum": maximum}
        print(five_summary)


        plt.xlabel("Infant mortality per 1000 births")
        plt.title("Infant mortality")
        plt.boxplot(statistic_data_new, patch_artist=True, vert=False)
        plt.show()

    def write_json_file(self, df):

        df['Region'] = df['Region'].str.strip()
        df1 = df.set_index('Country')

        json = df1.to_json("CountryData.json", orient='index')


if __name__ == "__main__":
    eda = EDA()



 # “Country”, “Region”, “Pop. Density (per sq. mi.)”,
 # “Infant mortality (per 1000 births)” and “GDP ($ per capita) dollars”
