#!/usr/bin/env python
# Name: Sam Kuilboer
# Student number: 12442690
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    with open("movies.html", encoding="utf8") as data:
        page_soup = BeautifulSoup(data, 'html.parser')

    # Saving the data in a vatiable
    containers = page_soup.findAll("div", {"class":"lister-item mode-advanced"})

    movies = []
    for container in containers:

        # checking for the title and the year of production
        title = container.find("h3", {"class":"lister-item-header"}).a.text
        # print(title)

        # checking for the year of the movie
        year = container.find("span", {"class":"lister-item-year text-muted unbold"}).text
        year = year.replace("(", "")
        year = year.replace(")", "")
        year = int(year.replace("I", ""))
        # print(year)

        # get the rating of the movie
        rating = container.find("div", {"class":"ratings-bar"}).strong.text
        # print(rating)

        # get the runtime of the movie
        actors_runtime_tag = container.find("div", {"class":"lister-item-content"})
        actors_runtime_tag = actors_runtime_tag.findAll("p", {"class":""})
        runtime = actors_runtime_tag[0].find("span", {"class":"runtime"}).text.replace(" min", "")
        # print(runtime)

        # get the actors of the movie
        stars = actors_runtime_tag[1].text.strip()
        stars = stars.replace("| \n    Stars:\n", ", ")
        stars = stars.replace("\n", "")
        stars = stars.replace("Directors:", "")
        actors = stars.replace("Director:", "")
        # print(actors)

        # appending the data to a list
        movie = []
        movie.append(title)
        movie.append(rating)
        movie.append(year)
        movie.append(actors)
        movie.append(runtime)

        # appending the movie to a list of movies and deleting it
        movies.append(movie)
        del movie

    # returning the list
    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    for movie in movies:
        writer.writerow(movie)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
