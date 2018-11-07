#!/usr/bin/env python
# Name: Sam Kuilboer
# Student number: 12442690
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# reforming the data
def average_movie():

    # creating an empty list and an empty dictionary
    data_dict = {}
    average_list = []

    # iterating over the differint years
    for year in range(START_YEAR, END_YEAR):
        movie_list = []

        # opening the file
        with open(INPUT_CSV, 'r') as csv_file:
            movies = csv.DictReader(csv_file)

            # iterating over the movies to get the right info
            for movie in movies:
                if int(movie["Year"]) == int(year):
                    movie_list.append(float(movie["Rating"]))

            # calculating the average
            if len(movie_list) != 0:
                average = round(sum(movie_list) / len(movie_list), 3)
            else:
                print("no average")

            # updating the averages to an dictionary
            data_dict.update({str(year) : average})

    # returning the data
    return data_dict

def visualizer(data):

    # getting the x and y values out of the data structure
    list_x = data.keys()
    list_y = data.values()

    # plotting the data in a plot
    plt.plot(list_x, list_y)
    plt.xlabel("Years")
    plt.ylabel("Average rating")
    plt.title("Average rating over the years")

    # printing the data in a plot
    plt.show()

# Global dictionary for the data
# data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}



if __name__ == "__main__":
    data_dict = average_movie()
    visualizer(data_dict)
