# ImageBank

A small project to maintain a bank of images with annotations. It fills a pretty specific need, but I'm sharing the code here in case anybody is interested or wants to use this as a starting point for a personal project.

## Build Process

To build the frontend (in the `react/` directory):

    yarn build

To run the app in a web browser, start the server:

    yarn start <db-file> <port=8501>

and point your browser to the specified port (default: 8501).

Running the app (either via Electron or as a standalone) requires a database file (the captions database).


## Creating an Image Database

To create an image databse, run

    yarn run create <db-file>


## Installing the server as a user agent under Mac OS X

Create a property list file `net.rpucella.imagebank.plist` in `~/Library/LaunchAgents/` such as:

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>Label</key>
        <string>net.rpucella.imagebank</string>
        <key>WorkingDirectory</key>
        <string> {{path to imagebank root}} </string>
        <key>ProgramArguments</key>
        <array>
            <string>/opt/homebrew/bin/node</string>
            <string>web/server.js</string>
            <string> {{path to database file}} </string>
        </array>
        <key>KeepAlive</key>
        <true/>
    </dict>
    </plist>

It should be picked up next login. To run the service before the next login, try:

    launchctl load ~/Library/LaunchAgents/net.rpucella.imagebank.plist


## Electron

(Not maintained)

To run the app via Electron after building the frontend:

    yarn start-electron
    
To build a standalone version of the app for your OS/architecture after building the frontend:

    yarn build-electron
    
On Mac OS X, the app requires a configuration file in a `~/Library/Application Support/ImageBank/` folder called `appConfig.json` containing a JSON object with at least field `ImageBankFolder` containing the folder in which you have your `images.db` database.

Note that since moving to an M1 Mac, I cannot build a native ImageBank app, and so will not be updating this code.


