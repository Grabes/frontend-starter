/**
  Frontend-starter

  @author Bartosz Sak, Archas
  
  https://github.com/implico/frontend-starter
  
  The MIT License (MIT)
  
  
  *******************
  Configuration file

*/

module.exports = function(dirs) {

  var fs   = require('fs');


  var config = {

    styles: {

      common: {
        sourceMaps: true,
        sourceMapsRoot: '/src/styles/',

        autoprefixer: {
          browsers: ['> 1%', 'last 3 versions', 'IE 8']
        },

        sass: {
        }
      },

      dev: {

        sass: {
          outputStyle: 'expanded'
        }
      },

      prod: {

        sourceMaps: false,

        sass: {
          outputStyle: 'compressed'
        }
      }
    },

    sprites: {

      items: [
        //you can add more items (dirs), simply add an element
        {
          imgSource: dirs.src.img + 'sprites/',
          imgDest: dirs.dist.img,
          //options passed to the plugin
          options: {
            imgName: 'sprites.png',
            imgPath: '../img/sprites.png',
            cssName: '_sprites.scss',
            cssSpritesheetName: 'spritesheet',
            cssVarMap: function (sprite) {
              sprite.name = /*'sprite_' + */sprite.name;
            }
          }
        }
      ],

      inject: {
        cancelTask: null,
        init: null,
        imgSrc: null, //must return a stream
        imgOptimize: null,
        imgDest: null,
        cssSrc: null,
        cssDest: null,
        finish: null
      },

      dev: {
        inject: {
          imgOptimize: false
        }
      },

      prod: {
      }
    },

    js: {
      common: {
        sourceMaps: true,
        sourceMapsRoot: '/src/',
        minify: false,
        concatVendorApp: true,    //if true, app.js and vendor.js are merged into app.js
        bowerFilter: ['**/*.js'],

        comps: {
          main: {
            filename: 'app',      //set to false to not produce any output file (for sub-comps); if not set, defaults to comp id
                                  //.js extension added automatically unless the name contains a dot
            //filenameVendor: 'vendor',//if concatVendorApp is false, specifies the vendor filename

            bower: ['**/*.js'],   //set only name of the package
            vendor: ['**/*.js'],  //path relative to the appropriate directory
            app: ['**/*.js'],     //path relative to the appropriate directory

            //set prioritized paths
            priority: {
              vendor: [],
              app: []
            },

            //set other comp ids to include
            dependencies: [],

            //set comps to exclude all loaded scripts in other comps, e.g.
            //excludeIn: ['comp1', 'comp2'] //excluded in selected comps
            //excludeIn: true   //excluded in all other comps
            //excludeIn: false  //no exclusion
            excludeIn: false,

            watch: true  //not needed, watch blocked only if false
          },

          html5shiv: {
            bower: ['html5shiv'],
            excludeIn: true,
            watch: false
          }
        },

        mainBowerFiles: {
          paths: {
            bowerDirectory: dirs.bower,
            bowerrc: dirs.app + '.bowerrc',
            bowerJson: dirs.app + 'bower.json'
          },
          overrides: {}
        },
        
        jsHint: {
          enable: false,
          options: {},
          reporter: 'default'
        }
      },

      dev: {
      },

      prod: {
        sourceMaps: false,
        minify: true,

        jsHint: {
          enable: false
        }
      }
    },

    views: {

      common: {
        useSwig: true,
        swig: {
          defaults: { cache: false },
          setup: function(swig) {
            swig.setDefaults({
              //set base dir
              loader: swig.loaders.fs(dirs.src.views.layouts)
            });
          },
          //variable context (data) passed to all templates
          data: {}
        }
      },

      dev: {
        swig: {

        }
      },

      prod: {
        swig: {

        }
      }
    },

    images: {
      optimize: {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      },

      inject: {
        cancelTask: null,
        cancel: null,

        init: null,
        changed: null,
        optimize: null,
        dest: null,
        finish: null
      },

      dev: {
        inject: {
          optimize: false
        }
      },

      prod: {

      },

      //compatibility fallback
      imagemin: {}
    },

    browserSync: {
      options: {
        //tip: set host to "[project-name].localhost" and set "open" to "external"
        host: 'localhost',
        open: 'local',
        port: 80,
        reloadOnRestart: true,
        server: {
          baseDir: dirs.dist.main
        }
      },

      inject: {
        cancelTask: null,
        cancel: null,
        init: null  //overrides default browserSync run, must return a promise or stream
      },

      dev: {
      },

      //only for prod:preview task
      prod: {
      },

      //compatibility fallback
      common: {
        options: {}
      }
    },

    clean: {
      //set to true for default config dir value, false to block deletion
      //or pass any glob pattern as an array (e.g. "styles: [dirs.dist.styles + 'style.css']" to delete only this one file)
      dist: false,       //only true/false; if true, whole dist dir is deleted
      styles: true,
      sprites: true,    //only true/false; set to false to block deletion of any generated by spritesmith SASS file in the src directory
      fonts: true,
      js: true,
      img: true,
      views: true,
      custom: true      //only true/false; set to false to block deletion of any custom dir
    }
  }

  //custom config file
  var noCustomFile = false;
  try {
    fs.accessSync(dirs.app + dirs.customConfig.configFile, fs.R_OK);
  }
  catch (ex) {
    noCustomFile = true;
    console.error('Frontend-starter warning: no custom config definitions file present (' + dirs.customConfig.configFile + ').');
  }

  //custom config file - require
  if (!noCustomFile) {
    require(dirs.app + dirs.customConfig.configFile)(config, dirs);
  }

  return config;
}
