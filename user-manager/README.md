# User Manager

This is the local backend connected to the Electron frontend. It also helps to connect to the cloud backend and provides core functionality. It is a Python Flask server and will be packaged together with the Electron application.

---

## Development (Windows)

## Running
```
cd ./src
set FLASK_APP=server.py
python server.py
```
### Virtual environment
```
+-- root
    +-- user-manager
        +-- src
            .
            .
            .
    +-- venv
________________

cd root
venv\Scripts\activate
cd file-manager\src
set FLASK_APP=server.py
python server.py

```

## Packaging
1. Run the below command
    ```
    cd ./src
    pyinstaller -w -F --add-data "resources;resources" server.py
    ```
2. Go to the generated `server.spec` file and:
    1. Remove the `[('v', None, 'OPTION')]` line
    2. Change the `debug=True` line to `debug=False`
3. Run the below command to build from spec file
    ```
    cd ./src
    pyinstaller -w -F --add-data "resources;resources" server.spec
    ```
4. `server.exe` file should be available in the `./dist` directory now
---

## Endpoints

| Endpoint | Method | Description | Parameters | Response
|-|-|-|-|-|
| /download | GET | Download file by given filename | String : filename, String: location, String: keypath | {} |
| /upload | POST | Upload file | String : filename, String: keypath or keylocation | {} |
| /upload/scan | POST | Scans file(s) for sensitive data | String: filepath | Array: Lists of issues |
| /filenames | GET | Get list of all files currently uploaded | | Array : List of filenames |
| /file | DELETE | Delete file from cloud storage | String: filename | {} |
| /shutdown | GET | Shutdown the server - to be used by the frontend cleanup activity | | {} |
| /user/create | POST | Creates a new user | String: username, String: email, String: password | {} |
| /user/details | GET | Get user details | String: username | Object: user details |
| /user/login | POST | Login a user | String: username, String: password | Object: Token and key ID |
| /user/logout | POST | Logout the user | | {} |

---

## Key Features

### TLS Encryption (HTTPS)
The endpoints of this server are using HTTPS which allows for all traffic travelling to and from to be encrypted. This is a signifcant safety feature of this application due to the information being sent to it - e.g. passwords, encrypted files etc - which should be kept secure.

The implementation of this is using Flask's built-in HTTPS support - `app.run(ssl_context='adhoc')` - and the pyopenssl package.

There are some caveats with this however. As it is using a self-signed certificate this is obviously not a production-grade solution. For something a bit more solid, certificates issued by a Certificate Authority (such as LetsEncrypt's CertBot) would be the way to go.

### File encryption
One of the key features of the application is the encryption of all files prior to storing the cloud. It is using the PyCryptodome AES (CBC Mode) encryption with a randomly generated key and initialisation vector. The key and IV are stored in a JSON file which is saved on the user's machine in a location of their choosing.

A lot of thought and research went into the key storage aspect of this design despite ultimately going with leaving it up to the user (like an SSH key). Similar to the TLS Encryption this was primarily to do with my own technical limitations. I had thought that I could possibly utilise a private-public key concept or secure storage in a RDS database but these are all options I will have to explore more thoroughly if given more time and capacity.

### Passwords
When creating a new user, the application does a number of checks in-line with the <strong>NIST Password Guidelines</strong>. This includes:
* Comparing the password against a password dictionary containing 14 million+ passwords - obtained from the RockYou data breach.
* Enforcing a minimum password length of 8
* Enforcing a maximum password length of 64

The password is then hashed with the <strong>bcrypt</strong> algorithm using the brcypt Python module and only the password hash is stored in the database. The algorithm was developed specifically for password hashing so includes a built-in salt and is considering a "slow-algorithm" perfect for preventing brute-force attacks.

These are standard security measures when handling passwords. Some other strong strategies which I found in my research and considered implementing (althought I ultimately did not - due to a combination of skill and time):
* Creating a mini module for generating permutations of common passwords and adding this to the password dictionary for comparison
* Adding a 2FA stage with either email or SMS authentication

### JWT Integration
The JWT integration is utilising the pyJWT package and the encryption is done with a private RSA key. The key pair is generated during login and the public key is sent off to the server instance. This public key will then be used for all subsequence authentications. The payload for the token is just the userID - i.e. `{ userID: "user1" }` - and this structure is used to verify that the token is as expected.

There are some issues with this security protocol - namely the setting up process with the public RSA key. This is not as secure given that the unauthenticated client is sending a key that is automatically accepted by the server. However, I do believe that this issue and the solution as a whole is acceptable given the scale of the project. It can be assumed that the set up procedure for the applications is less prone to attacks or risks.

Another question is the scalability of this solution. The lambda instance that the server is running on only has 50MB of `/tmp` storage to store the public keys.The ID of the key also has to be sent with each HTTPS call.

### File scanning
The file scanning functionality of this application checks all files given and looks for sensitive file extensions and sensitive data within text files.

File extension checking is just done by matching the end of the filename - i.e. `if filename.endswith(ext)`. The list of file extensions included in the "blacklist" is:
* .pem
* .key
* .ppk
* .der
* .csr
* .crt
* .cer
* .spc
* .p7a
* .p7b
* .p7c
* .p8
* .pfx
* .p12
* .jks

The files are first checked to see if they are text files - this is done via the Unix `file` module command: `file -b --mime-type <filename> | grep text`. This method is not perfect as some file types can be missed (e.g. application/yml) however, I do believe it covers the <b>majority</b> of file types. Each file is then opened and checked for the words below. The list of sensitive words it scans for in text files is:
* password
* key
* pwd
* secret
* cred
* token

This functionality helps to provide an extra check for users and advise them against storing extra-sensitive information. Whilst the storage is encrypted it is still risky and data such as private keys should rarely be stored remotely.

This is not a foolproof implementation of course given that the list of file extensions and words are hard-coded into the code however it does provide some basic protection. Some possible ways to extend this feature would be:
* Add patterns to the scanning list which could help to match API keys, tokens or cipher keys more accurately.
* Provide a recommendation for what to do with each issue
* Provide some capability to scan images of text - i.e. convert images into text to scan
* Include personal data such as names, emails or birthdates - these types of data are just as valuable as passwords and secrets.

As a bit of background, Google Cloud provides a feature similar to this via their [Cloud Data Loss Prevention](https://cloud.google.com/dlp/docs) feature which does data inspection. A number of similar products also exist for Git including the AWS Labs tool [git-secrets](https://github.com/awslabs/git-secrets) and GitHub's own [security scanning functionality](https://docs.github.com/en/code-security/secret-security/about-secret-scanning).

---

## Related documentation
* Flask documentation: https://flask.palletsprojects.com/en/1.1.x/
* PyCryptodome AES: https://pycryptodome.readthedocs.io/en/latest/src/cipher/aes.html
* Hashing passwords with bcrypt: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt
* Understanding bcrypt: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
* Have I been Pwned - Pwned Passwords: https://haveibeenpwned.com/Passwords
* NIST Password Guidelines: https://auth0.com/blog/dont-pass-on-the-new-nist-password-guidelines/
* JWT validation: https://medium.com/dataseries/public-claims-and-how-to-validate-a-jwt-1d6c81823826

