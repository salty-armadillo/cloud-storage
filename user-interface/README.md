# User Interface

This is the frontend of the application and is connected to the local Flask backend server (i.e. User Manager). It helps to provide a visual platform for users to upload, download and monitor their cloud storage. It is a Javascript React application that is supported with Electron and Electron Forge to help wrap it into a portable desktop application.

---

## Development (Windows)

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
cd ./src
npm run make
```
Note: The distributable will be available in the `out/` directory.

---

