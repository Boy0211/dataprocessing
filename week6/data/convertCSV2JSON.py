import pandas as pd
import copy

filename_IN = "RPOP_15122018150449599.csv"
filename_OUT = "data_final.csv"


def open_data(filename):
    df = pd.read_csv(filename, sep=',')
    return df


def process_data(df):
    countrys = []
    years = []
    genders = []
    population = []
    print(df)
    for i in range(len(df)):
        if df.loc[i]["Gender"] == "Total males+females":
            countrys.append(df.loc[i]["Country"])
            years.append(df.loc[i]["Year"])
            genders.append(df.loc[i]["Gender"])
            population.append(df.loc[i]["Value"])

    new_df = pd.DataFrame(
                        {'country': countrys,
                         'year': years,
                         'population': population
                         })

    # new_df = new_df.drop(index='Males', level=1)
    # new_df = new_df.drop(index='Females', level=1)
    # df = df.set_index("country")
    print(new_df)

    return new_df




def write_JSON(df):

    print(df)
    df.to_csv(filename_OUT, index=False)


if __name__ == '__main__':
    df = open_data(filename_IN)
    df = process_data(df)
    write_JSON(df)
