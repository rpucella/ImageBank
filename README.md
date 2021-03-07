# ImageBank

A small project to maintain a bank of images with annotations. It fills a pretty specific need, but I'm sharing the code here in case anybody is interested or wants to use this as a starting point for a personal project.

## Build Process

To build the frontend (in the `react/` directory):

    yarn build-react

To run the app in a web browser, start the server:

    yarn start-web

and point your browser to port 8501.

To run the app via Electron after building the frontend:

    yarn start
    
To build a standalone version of the app for your OS/architecture after building the frontend:

    yarn build
    
Running the app (either via Electron or as a standalone) requires a folder with `images.db` (the captions database) in it. Your best bet right now is to grab `images.db` from `tests/` — haven't added the ability to start a new image database yet. (I know, I know...) 

On Mac OS X, the app requires a configuration file in a `~/Library/Application Support/ImageBank/` folder called `appConfig.json` containing a JSON object with at least field `ImageBankFolder` containing the folder in which you have your `images.db` database.

(Update 11/26/20: actually, this no longer works, since `test/images.db` is version 1 of the database file, and we're now on version 2. I need to create a new test. Or provide a convenient way to initialize a new image database.)
