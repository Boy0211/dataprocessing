import pandas as pd
import csv

filename_IN = "data.csv"
filename_OUT = "data.json"

def open_data(filename):
    df = pd.read_csv(filename)
    return df

def process_data(df):
    df = df[["Country Name", "2017 [YR2017]"]]
    df = df.rename(columns = {'2017 [YR2017]':'Population', 'Country Name':'Country'})
    df = df[df.Population >= 1000000]
    df = df.dropna()

    return df

def write_JSON(df):
    df.to_json(filename_OUT, orient='records')


if __name__ == '__main__':
    df = open_data(filename_IN)
    df = process_data(df)
    write_JSON(df)
