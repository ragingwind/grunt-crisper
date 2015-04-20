# grunt-crisper

> Grunt plugin for [Crisper](https://github.com/PolymerLabs/crisper) that split inline scripts from an HTML file for CSP compliance

*Issues with the output should be reported on the `Crisper` [issue tracker](https://github.com/PolymerLabs/crisper/issues).*


## Install

```
$ npm install --save-dev grunt-crisper
```


## Usage

```js
crisper: {
  dist: {
    options: {
      cleanup: false
    },
    src: 'app/vulcanized.html',
    dest: 'dist/vulcanized-csp.html'
  }
};
```

## Config

### files

## Options

### cleanup

Type: `Boolean` Default: `false`

It's set cleanup to `True`, source file(vulcanized.html) will be removed after crisper task is done.

## License

MIT © [Jimmy Moon](http://ragingwind.me)
