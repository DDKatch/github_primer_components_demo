# README

Demo app to try primer components from github

Pages were generated with:
```
bin/rails generate scaffold Proposal source:string destination:string source_loading_date:datetime destination_unloading_date:datetime
```

To use primer view components it was necessary to use primer/css
There are basically 4 strategies for that:
- add node_modules/ folder to assets search path in initializers/assets.rb + dartscss-rails gem
- install package to vendors/assets/stylesheets + dartscss-rails gem
- load css package (maybe minified) from CDN directly from the page
- download css package (maybe minified) from CDN and put it into vendors/assets/stylesheets

For this particular repo I've chosen the 2 option

For project repo I recommend to use 4 option, because it's simple to setup and you will have the same css in dev and in prod (3 option may give you different styles for prod and dev environments)


## primer_view_components

Follow installation process described in [documentation](https://primer.style/design/guides/development/rails)


## dartscss + @primer/css

Follow installation process described in [documentation](https://github.com/rails/dartsass-rails)


#### Install @primer/css with yarn

```
yarn add @primer/css --modules-folder vendor/assets/stylesheets/
```


#### Build with dartscss.

```
bin/rails dartsass:build
```

In other case you will get an error on the page. In my case the error looked like this:

![](error.png?raw=true)
