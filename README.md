# RemoteJob
Remote job application development (open source) - in node js and electron

To run the app you have to have NodeJS and Java installed. Please follow the following instruction to run the app:

```bash
git clone https://github.com/aukgit/RemoteJob.git
```

```bash
git checkout dev
```

```bash
npm install
```

Copy and replace the sqlite3 node module from the `desktop-app > module_replace` directory

Then run

```bash
npm i -S electron
```

```bash
npm run rebuild
```

Edit the mail setting:

Add a new file named config.test.json in `js > mail`. Contents of the file will be:

```json
{
  "email":"yourmail@gmail.com",
  "pass": "your_password"
}
```

Change receiver email on  `mailer.js` file:

```js
//Go to line 25
to: 'receiver_email@gmail.com'
```

```bash
npm start
```

_N.B. Linux user might need to install scrot for screenshot_

To install *scrot* run the following command:

```bash
sudo apt-get install scrot
```
