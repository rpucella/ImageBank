# ImageBank

A small project to maintain a bank of images with annotations. It fills a pretty specific need, but
I'm sharing the code here in case anybody is interested or wants to use this as a starting point for
a personal project.

## To Build

This code has only been tested on Mac OS (arm64).

Install the dependencies:

    make install
    
To build the code:

    make
    
This will build the application in `dist/imagebank/`. To run the appropriate binary, use:

    ./dist/imagebank/imagebank-<arch>

Running the app requires a SQLite3 database file containing the images. You can initialize a
database by running `DDL/schema.sql` in SQLite3. The database needs to live in 

    ~/.config/imagebank/images.db


## (To come: Mac OS bundler)

