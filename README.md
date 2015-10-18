## overview

High-performance animation with react that compiles to both native mobile
(iOS for now) and web. Originally I [tried](https://gist.github.com/gilbox/56862676e8c46acabb5c)
doing it with react-native
but it was way too slow and janky. Instead, this project uses
[Ejecta](https://github.com/phoboslab/Ejecta) which natively implements
a subset of WebGL that works with [`threejs`](http://threejs.org/)
and thus [`react-three`](https://github.com/Izzimach/react-three).
Ultimately, it would be great if we could integrate this into react-native somehow.

## how?

For iOS compatibility, the minimum we need is a combination of
[Ejecta](https://github.com/phoboslab/Ejecta),
[threejs](threejs.org), and
[react-three](https://github.com/Izzimach/react-three),
and of course react 0.14+.
For creating fast functional animations in the demonstration game I used
[react-imation](https://github.com/gilbox/react-imation),
[react-stateful-stream](https://github.com/gilbox/react-stateful-stream), and
[updeep](https://github.com/substantial/updeep).
You could use [immutable-js](https://facebook.github.io/immutable-js/)
instead of updeep (I have no idea which one is faster),
but updeep is more fun to use.


## getting started

Clone this repo then:

    npm install

## build and run for iOS

        npm run build            # build
        open Ejecta.xcodeproj/   # open xcode

run the commands above then **click run in XCode**

Note: When you build for iOS, the output is `App/index.js`.

## build and run for web

### Without Hot Module Reload (HMR)

        npm start # start webpack and dev server

Run the command above then goto [http://localhost:3420/dev.html](http://localhost:3420/dev.html).
This configuration has inline source maps enabled.
Although this configuration doesn't support hot-reload, the page
*will* auto-refresh with any change.

### With HMR

        npm run hot-web # start webpack and dev server with HMR

Run the command above then goto [http://localhost:3420/dev.html](http://localhost:3420/dev.html).
*Note: needs improvement, generates a lot of WebGL warnings on hot loads*.
This configuration has inline source maps disabled so that hot reloads are faster.

## images directories

The default setup of this project is that there are two `images/` dirs:

- `App/images`
- `web/images`

Whenever you add an image to one dir, you should also add the same image
to the other dir. If all of your web images will be the same resolution as your
mobile images, it would probably be best to modify the build config such that
it avoids unnecessary copying.

## `npm run` scripts

Here are all of the build scripts and how you can use them:

- For iOS:
  * `npm run build` - Build once (for development)
  * `npm run watch` - Watch files for changes and build continuously (for development)
  * `npm run build-prod` - Build once (for production)
  * `npm run build-prod-watch` - Watch files for changes and build continuously (for production)

- For Web:
  * `npm start` - Continuous build and server (for development).
  * `npm run hot-web` - Continuous build and HMR server (for development).
  * `npm run build-web` - Build once (for development)
  * `npm run build-web-prod` - Build once (for production)

## FAQ

- *Q: what about android?*

  **A:** Ejecta only supports iOS. However,
  this project might very well work on Android using [cocoonjs](https://www.ludei.com/cocoonjs/).
  But I didn't test it because I spent a few minutes
  on cocoonjs website before getting discouraged. It has too many weird quirks for
  my taste. For example, to build you must upload a ZIP file (wtf year is this, 1990?).

- *Q: is it really fast enough to create a game?*

  **A:** Not sure yet.
  Ejecta and threejs seem fast enough, but is react fast enough? `¯\_(ツ)_/¯`

- *Q: i have a question!1!?*

  **A:** [Open an issue](https://github.com/gilbox/react-three-ejecta-demo/issues)
