// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  grunt.loadTasks("buildtasks");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.initConfig({

    meta: {
      handlebars: {
        trimPath: true,
        basePath: 'client/assets/templates/',
        extension: '.html'
      }
    },

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: ["client/dist/", "client/assets/templates"],

    // The jshint option for scripturl is set to lax, because the anchor
    // override inside main.js needs to test for them so as to not accidentally
    // route.
    jshint: {
      options: {
        scripturl: true,
        laxcomma: true,
        loopfunc: true
      }
    },

    // The jst task compiles all application templates into JavaScript
    // functions with the underscore.js template function from 1.2.4.  You can
    // change the namespace and the template options, by reading this:
    // https://github.com/tbranyen/build-tasks/tree/master/jst
    //
    // The concat task depends on this file to exist, so if you decide to
    // remove this, ensure concat is updated accordingly.

    // jst: {
    //   "dist/debug/templates.js": [
    //     "app/templates/**/*.html"
    //   ]
    // },

    stylus: {
      "client/assets/css/main.css": [
        "client/stylus/main.styl"//"client/stylus/**/*.styl"
      ]
    },

    jade: {
      dist: {
        files: {
          "client/assets/templates/footer.html": "client/app/modules/layout/footer.jade",
          "client/assets/templates/header.html": "client/app/modules/layout/header.jade",
          "client/assets/templates/resourceEditorItem.html": "client/app/modules/translate/resourceEditorItem.jade",
          "client/assets/templates/resourceEditorLayout.html": "client/app/modules/translate/resourceEditorLayout.jade"
        }
      }
    },

    handlebars: {
      "client/dist/debug/templates.js": [
        "client/assets/templates/*.html"
      ]
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.  It's named
    // dist/debug/require.js, because we want to only load one script file in
    // index.html.
    concat: {
      "client/dist/debug/require.js": [
        "client/assets/js/libs/almond.js",
        "client/dist/debug/templates.js",
        "client/dist/debug/require.js"
      ]
    },

    // This task uses the cssmin Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named index.css.  It
    // also minifies all the CSS as well.  This is named index.css, because we
    // only want to load one stylesheet in index.html.
    cssmin: {
      "client/dist/release/i18nextWT.css": [
        "client/assets/css/bootstrap-2.0.2.css",
        "client/assets/css/bootstrap-responsive-2.0.2.css",
        "client/assets/css/font-awesome-2.0.css",
        "client/assets/css/chosen-0.9.8.css",
        "client/assets/css/main.css"
      ]
    },

    // Takes the built require.js file and minifies it for filesize benefits.
    uglify: {
      dist: {
        files: {
          "client/dist/release/i18nextWT.js": [ "client/dist/debug/require.js" ]
        }
      }
    },

    copy: {
      main: {
        files: [
          {dest: "client/dist/release/assets", expand: true, cwd: "client/assets/", src: ["font/**/*"], filter: "isFile"},
          {dest: "client/dist/release/assets", expand: true, cwd: "client/assets/", src: ["/img/**/*"], filter: "isFile"},
          {dest: "client/dist/release/css/i18nextWT.css", src: ["client/dist/release/i18nextWT.css"]},
          {dest: "client/dist/release/js/i18nextWT.js", src: ["client/dist/release/i18nextWT.js"]},
          {dest: "client/dist/release/", expand: true, flatten: true, src: ["client/assets/index.html", "client/assets/favicon.ico"], filter: "isFile"}
        ]
      }
    },

    compress: {
      zip: {
        options: {
          mode: "zip",
          basePath: "client/dist/release/assets/",
          level: 1
        },
        files: {
          "client/dist/release/i18nextWT-0.1.0.zip": "client/dist/release/assets/**/*"
        }
      }
    },

    // Running the server without specifying an action will run the defaults,
    // port: 8080 and host: 127.0.0.1.  If you would like to change these
    // defaults, simply add in the properties `port` and `host` respectively.
    //
    // Changing the defaults might look something like this:
    //
    // server: {
    //   host: "127.0.0.1", port: 9001
    //   debug: { ... can set host and port here too ...
    //  }
    //
    //  To learn more about using the server task, please refer to the code
    //  until documentation has been written.
    // server: {
    //   files: { "favicon.ico": "client/assets/favicon.ico" },

    //   folders: {
    //       "app": "client/app",
    //       "assets": "client/assets",
    //       "app/templates": "client/assets/templates"
    //   },

    //   debug: {
    //     files: { "favicon.ico": "client/favicon.ico" },
    //     folders: {
    //       "app": "client/dist/debug",
    //       "assets/js/libs": "client/dist/debug"
    //     }
    //   },

    //   release: {
    //     // These two options make it easier for deploying, by using whatever
    //     // PORT is available in the environment and defaulting to any IP.
    //     host: "0.0.0.0",
    //     port: process.env.PORT || 8000,

    //     files: { "favicon.ico": "client/favicon.ico" },

    //     folders: {
    //       "app": "client/dist/release",
    //       "assets/js/libs": "client/dist/release",
    //       "assets/css": "client/dist/release"
    //     }
    //   }
    // },

    // grunt-contrib-requirejs
    requirejs: {
      compile: {
        options: {
          // Include the main configuration file
          mainConfigFile: "client/app/config.js",

          // Output file
          out: "client/dist/debug/require.js",

          excludeShallow: [
            "admin/adminViews"
            //, "modules/common/personProfile"
          ],

          // Root application module
          name: "config",

          // Do not wrap everything in an IIFE
          wrap: false
        }
      }
    },

    watch: {
      jade: {
        files: "client/**/*.jade",
        tasks: "jade"
      },

      stylus: {
        files: "client/stylus/**/*.styl",
        tasks: "stylus"
      }
    }

  });

  // The default task will remove all contents inside the dist/ folder, jshint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  grunt.registerTask("default", ["clean","jshint","jade","stylus","handlebars","requirejs","concat"]);

  // The debug task is simply an alias to default to remain consistent with
  // debug/release.
  grunt.registerTask("debug", "default");

  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask("release", ["default", "uglify" ,"cssmin","copy"]);

};
