<a href="https://pika-web-vue.powers.now.sh"><img alt="View Demo" src="https://img.shields.io/badge/%E2%96%B3-View%20Demo-black"/></a>

![Michael Scott’s Dunder Mifflin
        Scranton Meredith Palmer Memorial Celebrity Rabies Awareness Pro-Am Fun
        Run Race For The Cure](./src/static/michaelscottsdundermifflinscrantonmeredithpalmermemorialcelebrityrabiesawarenessproamfunrunraceforthecure.gif)

# @pika/web + TypeScript + Vue Example

Example using TypeScript, Vue, and [@pika/web][@pika/web], a new ESM bundler.
Uses Sass for styling.

## Other Languages

- [Preact][pika-web-preact]

## Example

```bash
npm i
npm start
```

It’ll run a multi-page app at `localhost:5000`.

## Vue-specific setup

Because we’re running Vue as an ESM package, there are a few key things we’ll have to do:

1. We can’t use the default `vue` package; we’ll have to use the browser ESM
   version (`/dist/vue.esm.browser.js`)
1. TypeScript doesn’t know what the types are for the browser ESM version, so
   we’ll have to trick TypeScript into using `vue` but swapping it out after
   TypeScript runs.
1. TypeScript’s JSX conversion doesn’t work for Vue, so we need
   `@vue/babel-preset-app` to convert it for us.

Let’s step through these one-by-one.

#### Using an alternate library build

TypeScript demands we use the following:

```ts
import Vue from "/web_modules/vue.js";
```

However we need `/web_modules/vue/dist/vue.esm.browser.js` for our ES Modules
app. Fortunately `babel-plugin-transform-rename-import` was made exactly for
this kind of situation. We’ll install that and modify `.babelrc`:

```json
{
  "plugins": [
    [
      "transform-rename-import",
      {
        "replacements": [
          {
            "original": "/web_modules/vue.js",
            "replacement": "/web_modules/vue/dist/vue.esm.browser.js"
          }
        ]
      }
    ]
  ]
}
```

And we’ll tell @pika/web to load that one instead in `package.json`:

```json
  "@pika/web": {
    "webDependencies": [
      "vue/dist/vue.esm.browser.js",
    ]
  },
```

We’ll set up Babel to run in the next step.

#### Compiling Vue JSX

TypeScript’s JSX conversion doesn’t work well with Vue’s compiler.
Fortunately Vue ships a `@vue/babel-preset-app` Babel preset that will take
care of everything. To use that we need to configure TypeScript to understand
JSX without transforming it. That’s what the `{ "jsx": "preserve" }` option
is for in `tsconfig.json`:

```json
"compilerOptions": {
  "jsx": "preserve",
}
```

Now if we run `tsc`, we end up with a whole bunch of `.jsx` files in our
directory:

```
public
├── components
│   ├── Home.jsx
│   └── Meredith.jsx
└── index.jsx
```

That’s actually a blessing in disguise that the browser can’t read those.
Next, we install `@vue/babel-preset-app` and add it to `.babelrc`:

```diff
 {
+  "presets": ["@vue/babel-preset-app"],
   "plugins": [
     [
       "transform-rename-import",
       {
         "replacements": [
           {
             "original": "/web_modules/vue.js",
             "replacement": "/web_modules/vue/dist/vue.esm.browser.js"
           }
         ]
       }
     ]
   ]
 }
```

Let’s target our new `.jsx` files and nothing else. In `package.json`:

```json
"scripts": {
  "build:js": "babel public --out-dir public -x .jsx",
  "build:js:watch": "babel --watch public --out-dir public -x .jsx"
}
```

This will allow us to run `npm run build:js` to convert all `.jsx` files to
`.js`:

```
public
├── components
│   ├── Home.js
│   ├── Home.jsx
│   ├── Meredith.js
│   └── Meredith.jsx
├── index.js
└── index.jsx
```

We can even `--watch` those `.jsx` files with Babel and we won’t enter an
endless loop! Because in this setup, TypeScript will only convert `.tsx` ➡️
`.jsx` and Babel will only convert `.jsx` ➡️ `.js` so there’s no overlap (nor
will either compiler recompile their own files over and over again).

### Why not just only use Babel?

You can use TypeScript’s Babel plugin in situations like this, and it will
save a step. However, you don’t get TypeScript’s full typechecking features
if you use Babel. And personally, that’s not worth it for me. A few extra
steps are always worth type safety.

[@pika/web]: https://github.com/pikapkg/web
[pika-web-preact]: https://dangodev/pika-web-preact
[vue-jsx]: https://vuejs.org/v2/guide/render-function.html
