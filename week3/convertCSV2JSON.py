import pandas as pd
import csv

filename_IN = "KNMI_19971231.txt"
filename_OUT = "data.csv"


def convert_year(date):
    year = date[0:4]
    month = date[4:6]
    day = date[6:8]
    
    date = str(f"{day}-{month}-{year}")
    month = str(f"{year}-{month}")

    return date, month

def get_monthyear(date):
    month = date[2:4]
    year = date[4:8]

    return month, year

def mean(list):
    mean = sum(list) / len(list)
    return mean

def convert_txt_csv():

    with open(filename_IN, "r") as f:

        data = f.readlines()
        new_data = []

        for i in data:
            if i[0] == '#':
                continue
            bilt, date, min_temp, max_temp = i.split(",")
            date, month = convert_year(date)
            print(date)
            new_data.append([date, month, min_temp.strip(), max_temp.strip()])

    with open(filename_OUT, "w") as f:
        writer = csv.writer(f)
        writer.writerow(["date", "month", "min_temp", "max_temp"])
        writer.writerows(new_data)

def process_data(df):
    df = pd.read_csv("data.csv")
    df = (df.groupby(['month'])['min_temp', 'max_temp'].mean())
    return df

def convert_csv_json():
    df = pd.read_csv("data.csv")
    # df = process_data(df)
    # print(df)
    json = df.to_json("data.json", orient='index')


if __name__ == '__main__':
    convert_txt_csv()
    convert_csv_json()
