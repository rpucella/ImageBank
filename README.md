# ImageBank

A small project to maintain a bank of images with annotations. It fills a pretty specific need, but I'm sharing the code here in case anybody is interested or wants to use this as a starting point for a personal project.

## Build Process

To build the frontend (in the `react/` directory):

    yarn build-react

To run the app in a web browser, start the server:

    yarn start <folder> <port=8501>

and point your browser to the specified port (default: 8501).

Running the app (either via Electron or as a standalone) requires a folder with `images.db` (the captions database) in it. 


## Creating an Image Folder

To create an image folder, run

    yarn init <folder>

It will create the folder and put in a default `images.db` file.


## Electron

To run the app via Electron after building the frontend:

    yarn start-electron
    
To build a standalone version of the app for your OS/architecture after building the frontend:

    yarn build-electron
    
On Mac OS X, the app requires a configuration file in a `~/Library/Application Support/ImageBank/` folder called `appConfig.json` containing a JSON object with at least field `ImageBankFolder` containing the folder in which you have your `images.db` database.

Note that since moving to an M1 Mac, I cannot build a native ImageBank app, and so will not be updating this code.


