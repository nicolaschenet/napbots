# Napbots auto-allocation tool

## Initial configuration
- Copy `.env.example` and rename it to `.env`
- Copy `compositions.example.js` and rename it to `compositions.js`
- Edit these files with your details

## How it works

### Install dependencies
```shell
yarn
```

### Launch the script
```shell
yarn auto-alloc
```
## Logging
The script will automatically log its results in the file specified in the `.env` file.
If you want to temporarily change the path of this file, you can call the script like this:
```
LOG_FILE_PATH=my-log-file yarn auto-alloc
```

## Scheduling with cron
```shell
# Launch Napbots auto allocation every 10 minutes
*/10 * * * * /usr/local/bin/node /path/to/script/folder/index.js

# Optionnally, clear the log once a day (or another frequency ^^)
@daily  rm /path/to/log/file
```
