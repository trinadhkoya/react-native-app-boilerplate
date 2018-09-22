# eslint-config-wix

> ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for all Wix projects


## Install

```
$ npm install --save-dev eslint-config-wix
```

For the `esnext` version you'll also need Babel's ESLint [parser](https://github.com/babel/babel-eslint) and [plugin](https://github.com/babel/eslint-plugin-babel):

```
$ npm install --save-dev babel-eslint
```

This will let you use ES2016 features like [`async`/`await`](https://github.com/lukehoban/ecmascript-asyncawait) and [decorators](https://github.com/wycats/javascript-decorators). For a full list of features see [Babel's experimental features](https://babeljs.io/docs/usage/experimental/) and their [Learn ES2015](https://babeljs.io/docs/learn-es2015/).


## Usage

Add some ESLint config to your `package.json`:

```json
{
	"name": "my-awesome-project",
	"eslintConfig": {
		"extends": "wix"
	}
}
```

Or to `.eslintrc`:

```json
{
	"extends": "wix"
}
```

Supports parsing ES2015, but doesn't enforce it by default.

This package also exposes [`wix/esnext`](esnext.js) if you want ES2015+ rules:

```json
{
	"extends": "wix/esnext"
}
```

And [`wix/angular`](angular.js) if you're using angular:

```json
{
	"extends": "wix/angular"
}
```

And [`wix/react`](react.js) if you're using react:

```json
{
  "extends": "wix/react"
}
```

And [`wix/mocha`](mocha.js) if you're using mocha:

```json
{
  "extends": "wix/mocha"
}
```

And [`wix/react-native`](react-native.js) if you're using react native:

```json
{
  "extends": "wix/react-native"
}
```
