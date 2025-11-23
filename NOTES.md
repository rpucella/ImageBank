
Neutralino version:

- package into an app bundle with a built in NodeJS?
- have a way to close the app (close window event?)
- have a "waiting to load" treatment
- larger pic - full width?
- put in a "location of imagefile" in neutralino local storage?
- if storage doesn't exist, put an error message in the app proper?

To build web version:

    npm run build
    npm run start
   
To run neutralino:

    npx @neutralinojs/neu run
    
To build neutralino:

    npx @neutralinojs/neu build
    ./build/imagebank/imageback-mac_arm64
    
Problem: doesn't look like it bundles the extension!
