
            var tmp = [undefined, 0];
            function RandomNumber ( max ) { return Math.floor(Math.random() * max); }
            function RandomNumberExcept ( max, except ) { var r = except; while (r == except) r = Math.floor(Math.random() * max); return r; }

            // Plugin default parameters - can be overriden with gShuffle.initialize( arguments )
            function options() {
                this.params = {
                    data : Array ("monalisa.jpg",     // [0] image
                                   5,                 // [1] number of columns
                                   8,                 // [2] number of rows
                                   67,                // [3] dimensions of a square cell
                                   1000               // [4] animation delay
                    )
                };
            };

            // Plugin base object
            $.gShuffle = function()
            {

            }

            // Runs the plugin
            var current = 0;
            var next    = 1;
            $.gShuffle.run = function()
            {
                var number_of_items = $.options.params.data[ 5 ];

                tmp[ 0 ] == undefined ? tmp[ 0 ] = RandomNumber( number_of_items ) : tmp[ 0 ] = tmp[ 1 ];
                tmp[ 1 ] = RandomNumberExcept( number_of_items, tmp[ 0 ] );
                var A = "#item" + tmp[ 0 ];
                var B = "#item" + tmp[ 1 ];

                $(A).stop().animate( { top: $(B).css("top"), left: $(B).css("left") }, $.options.params.data[ 4 ]);
                $(B).stop().animate( { top: $(A).css("top"), left: $(A).css("left") }, $.options.params.data[ 4 ]);

                var t = current;
                current = next;
                next = current;

                $(A).css("z-index", $(B).css("z-index"));
                $(B).css("z-index", $.options.params.data[ 5 ] + 1 );
            };

            // Initializes plugin
            $.gShuffle.initialize = function( ) /* assumes arguments are passed here to override default values in $.options.params.data */
            {
                // get options from the argument list
                $.options = new options();
                for(var i = 0; i < arguments.length; i++)
                    $.options.params.data[ i ] = arguments[ i ];

                // Here, I do an interesting thing that begs an explanation
                // I generally use the options.params.data array storage so it can persist between the two functions of this plug-in: plugin.initialize and plugin.run
                // However, the 6th index (the index 5 in the array) is not a function parameter and cannot be overriden
                // This parameter is simply used as a global storage of the number of all square cells in the image
                // The plugin only assumes 5 paramters and so, this technique effectively uses the array storage that already exists
                // to avoid creating a new variable in either plugin.initialize() or plugin.run(0) functions
                $.options.params.data[ 5 ] = $.options.params.data[ 1 ] * $.options.params.data[ 2 ];

                // Populate container
                var strContent = "";
                for (var i=0; i < $.options.params.data[ 5 ]; i++)
                    strContent += '<div id = "item' + i + '"></div><br/>';
                $("#ShuffleContainer").html( strContent );

                // Place cells into their default position and apply appropriate background coordinates
                var number_of_items = $("#ShuffleContainer > div").length;
                var i = 0,
                    x = 0,
                    y = 0,
                    z = 0;
                   var sss = "";
                $(this).find("#ShuffleContainer > div").each( function() {
                    $(this).css("background-image", "url(" + $.options.params.data[ 0 ] + ")");
                    $(this).css("background-position", -x + " " + -y);
                    $(this).css("z-index", 0);
                    $(this).css("left", x + "px");
                    $(this).css("top", y + "px");
                    x = x + $.options.params.data[ 3 ];
                    if (x > $.options.params.data[ 3 ] * ($.options.params.data[ 1 ] - 1))
                    {
                        x = 0;
                        y += $.options.params.data[ 3 ];
                    }
                    z++;
                });
            }