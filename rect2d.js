// ______________________________________________________________________

// members
//    bot
//    left
//    right
//    top
//    fillColor
//    borderColor
function rect2d() {}

rect2d.prototype =
{
    // @params coords   [ left, top, right, bottom ]
    // @param  fillColor
    // @param  borderColor
    // ======================================================================
    init: function( coords, fillColor, borderColor )
    {
        var data = [ 0, 0, 0, 0 ];
        if ((typeof coords === 'object') && Array.isArray( coords ))
            data = coords;
        else
        {
            data[0] = coords.left;
            data[1] = coords.top;
            data[2] = coords.right;
            data[3] = coords.bot;
        }

        this.left  = data[0];
        this.top   = data[1];
        this.right = data[2];
        this.bot   = data[3];

        this.fillColor   = fillColor;
        this.borderColor = borderColor;
        return this;
    },

    // ======================================================================
    draw: function( borderWidth )
    {
        // Convert rect vertices to canvas coords
        var topleft  = cell_to_canvas( this.left , this.top );
        var botright = cell_to_canvas( this.right, this.bot );

        var x = topleft.x;
        var y = topleft.y;

        var w = botright.x - x;
        var h = botright.y - y;

        var b = borderWidth;

        context.lineWidth = b;
        context.strokeStyle = this.borderColor;
        context.strokeRect( x-b, y-b, w+b*2, h+b*2 );

        context.fillStyle = this.fillColor;
        context.fillRect( x, y, w, h );
    },

    drawInsideCell( borderWidth )
    {
        // Convert rect vertices to canvas coords
        var topleft  = cell_to_canvas( this.left , this.top );
        var botright = cell_to_canvas( this.right, this.bot );

        var b = borderWidth;

        var x = topleft.x + b;
        var y = topleft.y + b;

        var w = botright.x - x;
        var h = botright.y - y;

        context.lineWidth = b;
        context.strokeStyle = this.borderColor;
        context.strokeRect( x+b, y+b, w-b-1, h-b-1 );

        context.fillStyle = this.fillColor;
        context.fillRect( x, y, w, h );
    },

    // ======================================================================
    getH: function()
    {
        var h = this.bot - this.top;
        return h;

    },

    // ======================================================================
    getW: function()
    {
        var w = this.right - this.left;
        return w;
    },

    // ======================================================================
    isPointInRect: function( x, y )
    {
        if( (x >= this.left && x <= this.right)
        &&  (y >= this.top  && y <= this.bot  ))
            return true;
        return false;
    },

    // ======================================================================
    moveTo: function( cell )
    {
        var w = this.getW();
        var h = this.getH();
        this.left  = cell.x;
        this.top   = cell.y;

        this.right = cell.x + w;
        this.bot   = cell.y + h;
    }
}
