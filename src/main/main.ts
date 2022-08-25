import { app, BrowserWindow, screen } from "electron";
import fs from "fs-extra";
import * as path from "path";
import { FotoboxMain } from "./app";

let win: BrowserWindow;

let fotoboxApplication: FotoboxMain = null;

async function createWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "assets/icon.png"),
  });
  win.setMenu(null);

  let pathToHtml = path.join(__dirname, "../../dist/renderer/index.html");
  if (!fs.pathExistsSync(pathToHtml)) {
    pathToHtml = path.join(__dirname, "../renderer/index.html");
  }

  fotoboxApplication = new FotoboxMain(win);
  await win.loadFile(pathToHtml);

  // Emitted when the window is closed.
  win.on("closed", async () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;

    await fotoboxApplication.deinit();
    fotoboxApplication = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
