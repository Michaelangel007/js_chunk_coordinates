// Globals
    var canvas, context, image, data;

    var gCanvasX = 0;
    var gCanvasY = 0;

    // GridSize NumCells -> CellSize
    var gGridW;
    var gGridH;

    var gCellSizeX = 50;
    var gCellSizeY = 50;

    // CellSize and NumCells -> GridSize
    var gNumCellsX = 6; // (gGridW-1)/gCellSizeX
    var gNumCellsY = 6; // (gGridH-1)/gCellSizeY
    //

    var gOffsetX = 0; // Center of Grid in pixels
    var gOffsetY = 0;

// Framebuffer

    // ========================================================================
    function draw()
    {
        context.putImageData( image, 0, 0 );
    }

    // ========================================================================
    function clear()
    {
        context.clearRect( 0, 0, canvas.width, canvas.height );
    }

    // ========================================================================
    function get()
    {
        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        data  = image.data;
    }

// Pixel

    /**
     * {Number}           x
     * {Number}           y
     * {Number|Array}     r
     * {Number|Undefined} g
     * {Number|Undefined} b
     * {Number|Undefined} a
     * Note:
     *   a = 0   transparent
     *   a = 255 opaque
     * Example:
     *   putpixel( 1, 2, 255, 0, 0, 255 );
     *   putpixel( 3, 4, [255, 0, 0, 255] );
     */
    // ========================================================================
    function putpixel( x, y, r,g,b,a)
    {
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] = r;
        data[i+1] = g;
        data[i+2] = b;
        data[i+3] = a;
    }

    // ========================================================================
    function addpixel( x, y, r,g,b,a)
    {
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] += r;
        data[i+1] += g;
        data[i+2] += b;
        data[i+3] += a;
    }

    // ========================================================================
    function subpixel( x, y, r,g,b,a)
    {
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] -= r;
        data[i+1] -= g;
        data[i+2] -= b;
        data[i+3] -= a;
    }

    // ========================================================================
    function mulpixel( x, y, r,g,b,a)
    {
        // var v = h - y; // put origin at bottom-left instead of top-left
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] *= r / 255;
        data[i+1] *= g / 255;
        data[i+2] *= b / 255;
        data[i+3] *= a / 255;
    }

    // ========================================================================
    function zoompixel( x, y, op, color )
    {
        var i, j;
        var u = sx-1;
        var v = sy-1;

        for( j = 0; j < v; j++ )
        {
            for( i = 0 ; i < u; i++ )
            {
                op( x*sx + i +  1, y*sy + j + 1, color ); // +1,+1 for grid border
            }
        }
    }

// Framebuffer Utility

    // ======================================================================
    function vline( x, color, h )
    {
        var y;

        for( y = 0; y < h; y++ )
            putpixel( x, y, color );
    }

    // ======================================================================
    function hline( y, color, w )
    {
        var x;

        for( x = 0 ; x < w; x++ )
            putpixel( x, y, color );
    }

    // @param color [r g b a] color of grid
    // @param w     Grid width  in pixels
    // @param h     Grid height in pixels
    // @param sx    cell size x in pixels
    // @param sy    cell size y in pixels
    // @param axis  OPTIONAL: [r, g, b, a] color of axis X and Y
    // @param axisY OPTIONAL: [r, g, b, a] color of axis Y
    // ======================================================================
    function grid( colorGrid, gridW, gridH, cellW, cellH, colorAxis, colorAxisY )
    {
        if (gridW === undefined) console.error( "Grid Width  not defined!" );
        if (gridH === undefined) console.error( "Grid Height not defined!" );
        if (cellW === undefined) console.error( "Grid Cell Size not defined!" );
        if (cellH === undefined) console.error( "Grid Cell Size not defined!" );

        var u = cellW-1;
        var v = cellH-1;
        var x,y;

        for( y = 0; y < gridH; y += cellH )
            hline( y, colorGrid, gridW );

        for( x = 0 ; x < gridW; x += cellW )
            vline( x, colorGrid, gridH );

        if( colorAxis !== undefined )
        {
            var colorX = colorAxis;
            var colorY = (colorAxisY !== undefined) ? colorAxisY : colorX;
            hline( gOffsetY, colorX, gridW ); // gridH/2
            vline( gOffsetX, colorY, gridH ); // gridW/2
        }
    }

    // Convert x,y to cartesian cell x,y
    // ======================================================================
    function canvas_to_cell( x, y )
    {
        return { x: ((x - gOffsetX) / gCellSizeX)|0,
                 y: ((y - gOffsetY) / gCellSizeY)|0 };
    }

    // ======================================================================
    function cell_to_canvas( x, y )
    {
        return { x: x*gCellSizeX + gOffsetX,
                 y: y*gCellSizeY + gOffsetY };
    }
