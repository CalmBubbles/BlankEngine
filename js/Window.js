/**
 * The static class for working with the window
 */
function Window()
{
    ThrowError(1);
}



// ---------- Static Properties

/**
 * Sets the fullscreen property of the window
 * @memberof Window
 */
Window.fullScreen = false;

/**
 * Sets what happens when fullscreen has entered
 */
Window.OnFullscreenEnter = function () { };

/**
 * Sets what happens when fullscreen has exited
 */
Window.OnFullscreenExit = function () { };



// ---------- Static Methods

/**
 * Sets the window base
 * @memberof Window
 * @param {string} title - The title of the window
 * @param {int} width - The width of the window in pixels
 * @param {int} height - The height of the window in pixels
 * @param {int} marginX - The width of the inner margin in percent
 * @param {int} marginY - The height of the inner margin in percent
 */
Window.SetBase = function (title, width, height, marginX, marginY)
{
    this.SetTitle(title);
    this.SetSize(width, height);
    this.SetMargin(marginX, marginY);
};

/**
 * Sets the window's title
 * @memberof Window
 * @param {string} title - The title of the window
 */
Window.SetTitle = function (title)
{
    var wTitle = "Untitled";
    
    if (title != null)
    {
        wTitle = title;
    }
    
    this.data.title = wTitle;
    document.title = this.data.title;
};

/**
 * Sets the window's size
 * @memberof Window
 * @param {int} width - The width of the window in pixels
 * @param {int} height - The height of the window in pixels
 */
Window.SetSize = function (width, height)
{
    if (width == null || height == null) return ThrowError(0);
    
    this.data.width = width;
    this.data.height = height;
    
    this.updateSize();
};

/**
 * Sets the inner margin's size
 * @memberof Window
 * @param {int} width - The width of the margin in percent
 * @param {int} height - The height of the margin in percent
 */
Window.SetMargin = function (width, height)
{
    this.data.marginX = width ?? 1;
    this.data.marginY = height ?? 1;
    
    this.updateSize();
};



// ---------- Events

/**
 * Called for initialization
 * @memberof Window
 */
Window.init = function ()
{
    Application.Load(this.data.width, this.data.height);
    
    this.data.marginX = 1;
    this.data.marginY = 1;
    
    this.SetTitle(this.data.title);
    this.updateSize();
    this.requestUpdate();
}

/**
 * Called for update
 * @memberof Window
 */
Window.requestUpdate = function ()
{
    requestAnimationFrame(this.update.bind(this));
};

/**
 * When updating
 * @memberof Window
 */
Window.update = function ()
{
    if (!document.hasFocus()) return this.requestUpdate();
    
    if (document.fullscreenElement && !this.fullScreen)
    {
        Window.OnFullscreenExit();
        document.exitFullscreen();
    }
    else if (!document.fullscreenElement && this.fullScreen)
    {
        Window.OnFullscreenEnter();
        document.documentElement.requestFullscreen();
    }
    
    this.updateSize();
    
    this.requestUpdate();
};

/**
 * Sets the window size from Window.data
 * @memberof Window
 */
Window.updateSize = function ()
{
    BlankEngine.Core.game.htmlCanvas.style.width = `${100 - this.data.marginX * 2}%`;
    BlankEngine.Core.game.htmlCanvas.style.height =  `${100 - this.data.marginY * 2}%`;
    
    if (this.data.resizable && this.fullScreen) return null;
    
    let sX = this.data.width + (this.data.width * (this.data.marginX * 2 / 100));
    let sY = this.data.height + (this.data.height * (this.data.marginY * 2 / 100));
    
    window.resizeTo(sX, sY);
};