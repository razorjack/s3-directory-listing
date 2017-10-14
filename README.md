# Automatic S3 Directory Listing

This project uses Serverless framework to create AWS Lambda function that
automatically (re)generates index.html files with directory listing whenever
you change something in your S3 bucket.

<img src="docs/demo.gif" width="640" height="500" alt="Demo">

Dark theme is also supported:

<img src="docs/dark.png" width="714" height="290" alt="Dark mode">

# TODO:

- [ ] Project structure (`src/`? `test/`?), move `index.pug` to a more proper place
- [ ] Support env variables, remove reference to my own bucket
- [ ] Support dark mode?
- [ ] Add `<title>` tag
- [ ] Add deployment instructions
