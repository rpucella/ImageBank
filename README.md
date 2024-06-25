# ImageBank

A small project to maintain a bank of images with annotations. It fills a pretty specific need, but
I'm sharing the code here in case anybody is interested or wants to use this as a starting point for
a personal project.

## To Build

Install the dependencies:

    yarn install
    
To build the code:

    yarn run build
    
To start the production server:

    yarn run start

By default, using port 3000 — to specify a port:

    yarn run start -p <port>
    
Running the app requires a SQLite3 database file containing the images. You can initialize a
database by running `DDL/schema.sql` in SQLite3. You can specify which database the app should use by
setting the environment variable `IMAGEBANK_DB_FILE` (possibly using a `.env.local` env file).


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
