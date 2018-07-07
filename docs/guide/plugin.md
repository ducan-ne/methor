# Write your plugin

## beforeEnter

```js
const MyPlugin = function() {
  this.beforeEnter(function(req, res, next) {
    const method = this.method
    if (
      // if something
    ) {
      return {success: true}
    }
    next()
  })
}
new Methor({plugins: [MyPlugin]})
```

## beforeHandleResponse

- to write option response

```js
const MyPlugin = function() {
  this.beforeEnter((result, next, req, res) => {
    // use arrow function here
    if (
      this.isObject(result.value) &&
      result.value.__file &&
      result.value.__file === 'ancms.html'
    ) {
      return fs.readFileSync(result.value.__file)
    }
    next()
  })
}
new Methor({ plugins: [MyPlugin] })
```
