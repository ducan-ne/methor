# Write your plugin

> Plugins expose the full potential of the Methor engine to third-party developers

Use staged build hooks, developers can introduce their own behaviors into the Methor. There is no strictly defined scope for a plugin, there are typically several types of plugins you can write:

- Add some checker `method`. eg [validator](./method-plugin-validate.md)
- Add some option response. eg send file
- Add some global method. eg system.info
- Add some Methor instance method by attaching them to Methor.prototype

A Methor plugin should expose an `install` method.

## Using a plugin

There are 2 method to install a `Plugin`:

- Use plugins by calling the `instance.use()` method:

```js
app.use(Methor.validator, options)
```

- Use plugins by adding the plugin to option `plugins`:

```js
new Methor({
  plugins: [Methor.validator]
})
```

# Hooks

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
