# JS_Tutorial
JavaScript Tutorial

---

## 1. Initialize a module with VueJs

```sh
npm init vue@latest
cd {project_name}
npm install
npm run dev
```

## 2. Using **WebPack**

Supposing this hierarchy:
|-- dist /- favicon.ico
|    |- index.html
|-- src /- index.js
|       |- sub.js
```

```

### Source Video 

![Youtube](https://www.youtube.com/watch?v=IZGNcSuwBZs)

[GitHub Repo](https://github.com/bradtraversy/webpack-starter)

We can execute:
```sh
npm init -y
npm i -D webpack webpack-cli
```
Inside `package.json` change script name `test` and content to be:
```json
"build": "webpack --mode production"
```
Then you can use:
```sh
npm run build
```
This will bundle the package into single main.js file inside the dist folder.
Afterthat we can use that `main.js` as a holistic script inside the `index.html`

```sh
npm i -D sass style-loader css-loader sass-loader
```
Then change `webpack.config.js`:
```js
module: {
        rules: [
            {
                test: /\.scss$/, /* Regex: Any file ends with .scss*/
                use: ['style-loader', 'css-loader','sass-loader'],
            }
        ]
    },
```
To generate automatically the HTML file:

```sh
npm i -D html-webpack-plugin
npm i -D webpack-dev-server
npm i -D babel-loader @babel/core @babel/preset-env
npm i axios
npm i webpack-bundle-analyzer
```