# ImageBank

A small project to maintain a bank of images with annotations. It fills a pretty specific need, but
I'm sharing the code here in case anybody is interested or wants to use this as a starting point for
a personal project.

## To Build

Install the dependencies:

    yarn install
    
To run the development server:

    yarn run dev
    
To build the production code:

    yarn run build
    
To start the production server:

    yarn run start

By default, using port 3000 — to specify a port:

    yarn run start -p <port>
    
Running the app requires a SQLite3 database file containing the images. You can initialize a
database by running `DDL/schema.sql` in SQLite3. You can specify which database the app should use by
setting the environment variable `IMAGEBANK_DB_FILE` (possibly using a `.env.local` env file).


