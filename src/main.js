const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const conf = require("bindings")("conf");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const confPath = path.join(app.getPath("desktop"), "counter.json");

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    /*
    // read counter only with js
    fs.readFile(confPath, (err, data) => {
        if (err) {
            console.warn(`*** couldn't read ${confPath}`);
            return;
        }
        try {
            const conf = JSON.parse(data);
            const counter = parseInt(conf.counterStartingPoint) || 0;
            console.log("setting counter to " + counter);
            // XXX: won't work if the file takes too long to load
            mainWindow.webContents.once("dom-ready", () => {
                mainWindow.webContents.send("set-counter", counter);
            });
        } catch (e) {
            console.warn(`*** couldn't parse ${confPath}`);
        }
    });
    */

    // read counter through addon
    mainWindow.webContents.once("dom-ready", () => {
        const counter = conf.readCounter(confPath);
        mainWindow.webContents.send("set-counter", counter);
    });

    ipcMain.on("update-counter", (e, newval) => {

        console.log("setting new counter to " + newval);

        /*
        // update counter only with js
        fs.readFile(confPath, (err, data) => {
            try {
                let conf = JSON.parse(data);
                conf.counterStartingPoint = newval;
                fs.writeFile(confPath, JSON.stringify(conf, null, 4), (err) => {
                    if (err) console.warn(err);
                });
            } catch (e) {
                console.warn(`*** couldn't update ${confPath}`);
            }
        });
        */
        // update counter through addon
        conf.writeCounter(confPath, newval);
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
