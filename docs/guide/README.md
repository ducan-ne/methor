# Introduction

Methor is composed of two parts: a minimalistic and flexible framework web with Node.js, and a fast generator web application.
It was created to support the owner build his website.

Each method generated to nested path (Like `auth.login`), providing easily way to call api. When you need create new `API`, just go to folder, create file, coding and done. However, you can define option route like `express` style. Additional method are fetched on your `Object`.

## How It Works

- First, `Methor` transform object from `{user: {login: [Function]}}` to `{'user.login': Function}`. When user request to API, `Methor` excecuted method. This is inspired by Facebook's `api.facebook.com/method/auth.login` API

- Parameter useful inspired by angularjs

- `Methor` powered by [Router](https://github.com/pillarjs/router), works by layers

## Todo

Methor is still a work in progress.
Contributions are welcome!
