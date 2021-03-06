module.exports = function ( grunt ) {
  'use strict';

  var fs = require( 'fs' );
  var path = require( 'path' );
  var mkdirp = require( 'mkdirp' );

  grunt.registerMultiTask( 'appIcons', 'create app icons', function () {

    var done = this.async();
    var im = require( 'imagemagick' );

    var options = this.options( {
      type: [], // all, favicon, touch, ios, android
      createDirectories: false,
      precomposed: true,
      precomposedString: '-precomposed',
      args: []
    } );

    var remaining = this.files.length;

    this.files.forEach( function ( file ) {

      if ( options.type.length > 0 ) {

        var image = file.src[0];
        var folder = path.dirname( file.dest ) + '/' + path.basename( file.dest ) + '/';
        var folders = [folder];

        // Create path folders, if needed
        mkdirp.sync(path.dirname( file.dest ));

        if ( options.type.indexOf( 'all' ) >= 0 ) {
          options.type = ['favicon', 'touch', 'ios', 'ios6', 'android']
        }

        if ( options.createDirectories ) {
          folders = [];
          options.type.forEach( function ( type ) {
            folders.push( folder + type + '/' );
          } );
        }

        var remainingTypes = options.type.length;
        var remainingFolders = folders.length;

        folders.forEach( function ( f ) {
          fs.mkdirParent( f, null, function () {
            if ( -- remainingFolders <= 0 ) {
              options.type.forEach( function ( type ) {
                if ( icons.hasOwnProperty( type ) ) {
                  var remainingIcons = icons[type].length;
                  icons[type].forEach( function ( iconOptions ) {
                    var iconFolder = folder;
                    if ( options.createDirectories ) {
                      iconFolder += type + '/';
                    }
                    var iconName = iconOptions.name;
                    if ( options.precomposed ) {
                      iconName = iconName.replace( /%precomposed%/g, options.precomposedString );
                    }
                    var iconArgs = iconOptions.args || [];
                    var taskArgs = options.args || [];
                    if ( typeof taskArgs === 'function' ) {
                      taskArgs = taskArgs( iconOptions.resize );
                    }
                    if ( iconOptions.resize ) {
                      iconArgs = ['-resize', iconOptions.resize].concat( iconArgs );
                      taskArgs = taskArgs.map( function( arg ) {
                        return arg.replace( /%size%/g, iconOptions.resize );
                      } );
                    }
                    var args = [image].concat( iconArgs ).concat( taskArgs ).concat( [iconFolder + iconName] );
                    im.convert( args, function ( error ) {
                      if ( error ) {
                        grunt.log.errorlns( error );
                      } else {
                        grunt.log.writeln( 'Created: ' + iconName );
                      }
                      if ( -- remainingIcons <= 0 ) {
                        if ( -- remainingTypes <= 0 ) {
                          if ( -- remaining <= 0 ) {
                            done();
                          }
                        }
                      }
                    } );
                  } );
                } else {
                  if ( -- remainingTypes <= 0 ) {
                    if ( -- remaining <= 0 ) {
                      done();
                    }
                  }
                }
              } );
            }
          } );
        } );

      } else {
        grunt.log.error( 'No type option specified, allowed: all, favicon, touch, ios, android' );
        if ( -- remaining <= 0 ) {
          done();
        }
      }

    } );

  } );

  var iosLargeIcons = [
      {name: 'Icon-60@2x.png', resize: '120x120'},
      {name: 'Icon-60@3x.png', resize: '180x180'},
      {name: 'Icon-76.png', resize: '76x76'},
      {name: 'Icon-76@2x.png', resize: '152x152'},
      {name: 'Icon-83.5@2x.png', resize: '167x167'}
  ];

  var iosSmallIcons = [
      {name: 'Icon-Small-40.png', resize: '40x40'},
      {name: 'Icon-Small-40@2x.png', resize: '80x80'},
      {name: 'Icon-Small-40@3x.png', resize: '120x120'},
      {name: 'Icon-Small.png', resize: '29x29'},
      {name: 'Icon-Small@2x.png', resize: '58x58'},
      {name: 'Icon-Small@3x.png', resize: '87x87'}
  ];

  var ios6LargeIcons = [
      {name: 'Icon.png', resize: '57x57'},
      {name: 'Icon@2x.png', resize: '114x114'},
      {name: 'Icon-72.png', resize: '72x72'},
      {name: 'Icon-72@2x.png', resize: '144x144'}
  ];

  var ios6SmallIcons = [
      {name: 'Icon-Small-50.png', resize: '50x50'},
      {name: 'Icon-Small-50@2x.png', resize: '100x100'}
  ];

  var icons = {
    ios: iosLargeIcons.concat(iosSmallIcons),
    iosLarge: iosLargeIcons,
    iosSmall: iosSmallIcons,
    ios6: ios6LargeIcons.concat(ios6SmallIcons),
    ios6Large: ios6LargeIcons,
    ios6Small: ios6SmallIcons,
    android: [
      {name: 'icon-ldpi.png', resize: '36x36'},
      {name: 'icon-mdpi.png', resize: '48x48'},
      {name: 'icon-hdpi.png', resize: '72x72'},
      {name: 'icon-xhdpi.png', resize: '96x96'},
      {name: 'icon-xxhdpi.png', resize: '144x144'},
      {name: 'icon-xxxhdpi.png', resize: '192x192'}
    ],
    androidDirectories: [
      {name: 'drawable-ldpi/icon.png', resize: '36x36'},
      {name: 'drawable-mdpi/icon.png', resize: '48x48'},
      {name: 'drawable-hdpi/icon.png', resize: '72x72'},
      {name: 'drawable-xhdpi/icon.png', resize: '96x96'},
      {name: 'drawable-xxhdpi/icon.png', resize: '144x144'},
      {name: 'drawable-xxxhdpi/icon.png', resize: '192x192'}
    ],
    androidNotifications: [
      {name: 'notification-icon-ldpi.png', resize: '18x18'},
      {name: 'notification-icon-mdpi.png', resize: '24x24'},
      {name: 'notification-icon-hdpi.png', resize: '36x36'},
      {name: 'notification-icon-xhdpi.png', resize: '48x48'},
      {name: 'notification-icon-xxhdpi.png', resize: '72x72'},
      {name: 'notification-icon-xxxhdpi.png', resize: '96x96'}
    ],
    iosStore: [
      {name: 'iTunesArtwork.png', resize: '512x512'},
      {name: 'iTunesArtwork@2x.png', resize: '1024x1024'}
    ],
    playStore: [
      {name: 'icon-google-play.png', resize: '512x512'}
    ],
    amazonStore: [
      {name: 'icon-amazon-small.png', resize: '114x114'},
      {name: 'icon-amazon-large.png', resize: '512x512'}
    ],
    favicon: [
      {
        name: 'favicon.ico',
        args: [
          '(', '-clone', '0', '-resize', '16x16', ')',
          '(', '-clone', '0', '-resize', '32x32', ')',
          '(', '-clone', '0', '-resize', '48x48', ')',
          '(', '-clone', '0', '-resize', '64x64', ')',
          '-delete', '0',
          '-alpha', 'off',
          '-colors', '256'
        ]
      }
    ],
    touch: [
      {name: 'apple-touch-icon%precomposed%.png', resize: '57x57'},
      {name: 'apple-touch-icon-76x76%precomposed%.png', resize: '76x76'},
      {name: 'apple-touch-icon-120x120%precomposed%.png', resize: '120x120'},
      {name: 'apple-touch-icon-152x152%precomposed%.png', resize: '152x152'},
      {name: 'apple-touch-icon-180x180%precomposed%.png', resize: '180x180'},
      {name: 'touch-icon-128x128.png', resize: '128x128'},
      {name: 'touch-icon-192x192.png', resize: '192x192'}
    ]
  };

  fs.mkdirParent = function ( dirPath, mode, callback ) {
    fs.mkdir( dirPath, mode, function ( error ) {
      if ( error && error.errno === 34 ) {
        fs.mkdirParent( path.dirname( dirPath ), mode, callback );
        fs.mkdirParent( dirPath, mode, callback );
      }
      callback && callback( error );
    } );
  };

};
