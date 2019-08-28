# crptic wave 1327

Andrews playground

A drag and drop wiki

## Running Locally


```sh
$ heroku local
```

Your app should now be running on [localhost:5000](http://localhost:5000/).
run test script (as below)

## Running on Heroku


```sh
$ git commit -am 'some comment'
$ git push heroku master
$ heroku open
```

Your app should now be running on [https://cryptic-wave-1327.herokuapp.com/](https://cryptic-wave-1327.herokuapp.com//).
run test script (as below)


In several browsers (firefox and chrome, for instance)

1. Open page
2. drag a 'drag me around' box. it should drag

To run without heroku, export all variables in .env, and the run node server.js


## Housekeeping

 - npm i -g npm node mocha jshint snyk sinopia node-gyp bower
 - ncu - check for updates
 - ncu -g check global updates
 
 npm view <pkg> versions
 
 - check lints and tests are all being run. It's too easy to miss one out
 
I'm using a git repo of font-awesome. upgrade that ocassionally.

## TODO

 - Caching of various http points
 - In packages, add test run into general flow of testing
 - fix broken persistence tests
