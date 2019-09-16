![Michael Scott’s Dunder Mifflin
        Scranton Meredith Palmer Memorial Celebrity Rabies Awareness Pro-Am Fun
        Run Race For The Cure](./src/static/michaelscottsdundermifflinscrantonmeredithpalmermemorialcelebrityrabiesawarenessproamfunrunraceforthecure.gif)

# @pika/web + TypeScript + Vue Example

Example using TypeScript, Vue, and [@pika/web][@pika/web], a new ESM bundler.

This also uses a **non-default ESM build** (`vue/dist/vue.esm.browser` rather
than the default), which is [explained below][section-babel].

## Example

```bash
npm i
npm start
```

It’ll run a multi-page app at `localhost:5000`.

To rebuild changes, run `npm run build`. There’s not a watch script for this
project because we’re using [Babel transformations][section-babel], and that
setup could get very involved with hot module reloading; if you’d like to
this up see [the explanation why][section-babel] to get an idea of what’s
needed.

### ✨ Comparison to [pika-web-preact][pika-web-preact]

This project is identical to [the Preact equivalent][pika-web-preact] except
for one major difference (other than the obvious usage of Vue instead of
Preact): we’re using a specific library build: `vue/dist/vue.esm.browser.js`
rather than the `module` default. The reason is: the module default has a
problem when we try and run it:

```
[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
```

To fix this we have a choice:

1. we can either precompile our templates with
   [@vue/babel-plugin-transform-vue-jsx][babel-vue] (or something similar), or
1. we can use the alternate Vue.js build that’s ~10 KB heavier but handles
   compiling templates for us.

Either way we will have to set up Babel, though, either choice will have a
similar solution. For your app, your choice may have tradeoffs, but for this
example I chose the latter approach mostly out of curiosity: _how easy is it
to use a non-default module for @pika/web?_

To solve this, we’ll have to do 2 things:

1. Compile our JS to import the build of Vue we want
1. Configure @pika/web to include that build

#### Compile JS to import a specific build

Let’s start by trying the simplest solution:

```ts
import Vue from "/web_modules/vue/dist/vue.esm.browser.js";
// 🚫 Could not find a declaration file for module '/web_modules/vue/dist/vue.esm.browser.js'. 'vue.esm.browser.js' implicitly has an 'any' type.
```

Hol up; TypeScript didn’t like that. Maybe we can fix that somehow?

```ts
declare module "/web_modules/vue/dist/vue.esm.browser.js" {
  export * from "vue";
}
// 🚫 Invalid module name in augmentation. Module '/web_modules/vue/dist/vue.esm.browser.js' resolves to an untyped module at 'vue.esm.browser.js', which cannot be augmented.
```

Unfortunately that didn’t work either. Running into dead ends trying to tell
TypeScript where to get its types, I decided to just skip it and let
TypeScript compile with the wrong imports. After it’s done we can use a Babel
helper—[babel-plugin-transform-rename-import][babel-transform-import]—that
will rename what we want (also, keeping the default imports in your
TypeScript code is probably for the best anyway, because this means you could
decide later if you wanted to use a different build, without modifying any
code).

To configure that, install:

```bash
npm i -D @babel/core @babel/cli babel-plugin-transform-rename-import
```

And add a `.babelrc` to the root of your project:

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

Lastly, we’ll set up Babel to run at the end of our `build` script in
`package.json`:

```json
  "scripts": {
    "build": "rm -rf dist && npm run build:esm && npm run build:ts && npm run build:js && npm run build:css && npm run copy",
    "build:esm": "pika-web --dest dist/web_modules --optimize --babel=false",
    "build:js": "babel dist --out-dir dist",
  }
```

Notice that we are using `--optimize` and `--babel=false` for @pika/web. The
first flag minifies our JS, but that flag also for some reason enables Babel
to run on our web modules. We only want to transform our code, so we disable
that.

Now when we look at our TypeScript, we’re still using the following:

```ts
import Vue from "/web_modules/vue.js"; // this tells TypeScript what types to use
```

And when we inspect our output JS, after Babel hits it:

```js
import Vue from "/web_modules/vue/dist/vue.esm.browser.js"; // 🎉
```

This gets us the best of both worlds: correct types, and the browser behavior
we want. But we’re not done, yet—@pika/web is still bundling the wrong version

#### Configuring @pika/web

Fortunately, configuring @pika/web is much easier. In our `package.json`, we
have the following:

```json
  "@pika/web": {
    "webDependencies": [
      "vue",
      "vue-router"
    ]
  },
```

To choose a specific module build, we’ll change it to the following:

```json
  "@pika/web": {
    "webDependencies": [
      "vue/dist/vue.esm.browser.js",
      "vue-router"
    ]
  },
```

That’s it! Next time @pika/web runs, it’ll use the specific build we want.

#### Recap

So let’s go over what we did again:

- We are still using default imports in our TypeScript (`import Vue from '/web_modules/vue.js';`)
- After TypeScript compiles, we’re using Babel on our JS and renaming the Vue
  imports to use the build we want
- We’re telling @pika/web in `package.json` which Vue build to bundle

**Advantages**
Now that everything’s configured, you can swap out the build
you wanted to use for Vue (or any other library for that matter) by only
modyfiyng a meager 2 files: @pika/web’s config `package.json` and `.babelrc`
🎉

**Disadvantages**

Adding Babel on top of TypeScript is a bit of an extra hassle in general. But
specifically, it makes setting up a watch process hard because you can’t use
`babel --watch` on the destination folder otherwise you’d have an infinite
loop. You’d basically have to set up a [Gulp][gulp] task to handle the whole
chain.

### 💁 Explanation (duplicated from [pika-web-preact][pika-web-preact])

Type handling is the difficult part of using TypeScript with @pika/web, since
browsers don’t support it. The core concepts of pulling this off are:

1. Having a separate `src/` and `dist/` folders
1. Using this fix in `tsconfig.json` ([discussion][tsconfig]):
   ```json
     "compilerOptions": {
       "paths": {
         "/web_modules/*.js": [
           "node_modules/@types/*",
           "node_modules/*",
           "web_modules/*.js",
         ]
       }
     }
   ```

The first point is a rather obvious one: since TypeScript isn’t supported by
browsers, we’ll have to keep our source code separate from our compile
directory. That’s easy enough, but when you compile it, now you have a lot of
these in your code:

```js
import vue from "vue";
```

A browser doesn’t know what to do with that! That’s not a proper path, and
it’s also missing the `.js` extension. However, if you try modifying your TypeScript to:

```ts
import vue from "./web_modules/vue.js";
```

Now TypeScript can’t load the files! However, by aliasing these imports a
special way, we can do something clever:

```json
  "compilerOptions": {
    "paths": {
      "/web_modules/*.js": [
        "node_modules/@types/*",
        "node_modules/*",
        "web_modules/*.js",
      ]
    }
  }
```

This lets us do the following in our project (we’ll always need to do this
for all @pika/web modules):

```ts
import Vue from "/web_modules/vue.js";
```

Let’s break down what this tells TypeScript:

- `/web_modules/*.js` tells TypeScript to take any import matching this
  pattern and treat it differently (“this pattern” meaning any import that
  starts with a `/`, then has `web_modules`, then anything (`*`), then ends in
  `.js`).
- How should TypeScript treat them differently? Well, it should try and find the `*` in any of the following folders:
  - First, try `node_modules/@types/*` (for the modules that have external types)
  - Next, try `node_modules/*` to see if the original library has types
  - Lastly, try `web_modules/*` to see if @pika/web ported the types over.

Usually, the types will be found somewhere within `node_modules` and
TypeScript is happy.

But wait—what about browsers? Well that’s the best part! If we look at our output code:

```js
import Vue from "/web_modules/vue.js";
```

That `/web_modules/vue.js` resolves to be an actual path to our ESM on our
server (assuming `web_modules` was installed at the root)! So the alias we
were using for TypeScript also happened to be a valid path the browser
understands.

If you need to install `web_modules` somewhere else other than the root, then
you can change the `--dest` of @pika/web as well as the option under
`"paths"` in `tsconfig.json` as-needed.

---

If you’re using ESLint, you’ll have to add a few more rules to keep it happy
(you may already be familiar with this if you’ve used TypeScript before):

```json
{
  "rules": {
    "import/extensions": "off", // we need this for browsers
    "import/no-absolute-path": "off", // we also need this
    "import/no-unresolved": "off" // TypeScript got this
  }
}
```

[@pika/web]: https://github.com/pikapkg/web
[babel-plugin]: https://github.com/dangodev/babel-plugin-import-pika-web
[babel-transform-import]: https://github.com/laat/babel-plugin-transform-rename-import
[babel-ts]: https://babeljs.io/docs/en/next/babel-plugin-transform-typescript.html
[babel-vue]: https://github.com/vuejs/jsx/tree/master/packages/babel-plugin-transform-vue-jsx
[gulp]: https://gulpjs.com
[pika-web-preact]: https://github.com/dangodev/pika-web-preact/
[section-babel]: #-comparison-to-pika-web-preact
[tsconfig]: https://github.com/pikapkg/web/issues/4#issuecomment-469094924
