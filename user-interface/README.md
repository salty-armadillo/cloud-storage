# User Interface

This is the frontend of the application and is connected to the local Flask backend server (i.e. User Manager). It helps to provide a visual platform for users to upload, download and monitor their cloud storage. It is a Javascript React application that is supported with Electron and Electron Forge to help wrap it into a portable desktop application.

1. [Development](#development)
    1. [Running](#running)
    2. [Packaging](#packaging)
2. [Key features](#key-features)
    1. [Packaging (Electron-Forge)](#packaging-\(electron-forge\))
    2. [Global store](#global-store)
    3. [Process communication](#process-communication)

---

## Development
<b>Note:</b> All commands below have only been tested in a Windows environment.

### Running
```
cd .
rm -rf node_modules
npm install
npm start
```

### Packaging
```
+-- user-interface
    +-- out
        +-- Cloud Storage
            +-- CloudStorage.exe
    +-- src
        +-- server.exe
        .
        .
        .

________________

cp <location of generated server.exe> ./src/server.exe
cd .
npm run make
```
Note: The distributable will be available in the `out/` directory.

---

## Key features

### Packaging (Electron-Forge)
This Electron application is packaged and turned into a distributable with the help of the Electron-Forge package. 

When packaging, the backend local Flask application is also packaged into an executable (see user-manager/README.md) which is then added to this repository. The main process in `main.js` will then execute the Python executable as a child process and make it available to connect to.

On shutdown, the main process will call the `/shutdown` endpoint of the Flask server into to terminate it and clean it up.

### Global store
I had originally intended to use Redux for the global store (as typically used in React web development) however it turns out that due to Electron's multi-process setup, it doesn't work and instead a store is created for each individual component (thus contradicting the idea of a <b>global</b> store.).

However, there is a fantastic package called `electron-store` which allowed me to do basically the same thing. It has an object as the global store and allows for various functions to apply changes to the store. This was used for storing data such as the user's ID, token and key once logged in.

### Process communication
When an Electron app is built and begins to run there are two different processes that will startup. The <i>main</i> process and the <i>renderer</i> process. The main process takes care of the creating the browser window and the settings around that whilst the renderer process does the actual rendering for what appears in the window.

In order to allow these two processes to talk to each other, Electron has Inter-Process Communication (IPC) that allows both the main and renderer process to essentially push messages to each other. I have used this process for my global state store. The store is created in the main process but is utilised by the renderer process (i.e. the components).

Initial setup of the store (`main.js`):
```
const store = new Store();

// Initial store state
store.set("loggedIn", false);
store.set("userId", "");
store.set("token", "");
store.set("keyId", "");

ipcMain.on("login", (_, payload) => {
  store.set("loggedIn", true);
  store.set("userId", payload.userId);
  store.set("token", payload.token);
  store.set("keyId", payload.keyId);
})
```

Component adding variables to the store (`LoginPage.js`):
```
ipcRenderer.send("login", {
    userId: username,
    token: token,
    keyId: keyID
})
```
