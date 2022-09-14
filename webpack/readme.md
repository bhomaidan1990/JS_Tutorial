# WebPack Tutorial Repo

<div>
    <a href="https://www.youtube.com/watch?v=IZGNcSuwBZs">
            <img alt="Qries" src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
            width="30" height="30">
    </a>
    <a href="https://github.com/bradtraversy/webpack-starter">
            <img alt="Qries" src="https://1000logos.net/wp-content/uploads/2021/05/GitHub-logo-500x281.png"
            width="55" height="30">
    </a>
</div>

> Tutorial's YouTube and github assets

---

## Usage:

```sh
npm install
npm run build
npm run dev
```

---

## Tutorial workflow (already done for you)

1. To Initialize the repo:
```sh
npm init -y
npm i -D webpack webpack-cli
```
2. Then inside `package.json` change script name `test` and content to be:
```json
"build": "webpack --mode production"
```
3. Then you can use:
```sh
npm run build
```
4. This will bundle the package into single main.js file inside the dist folder.
Afterthat we can use that `main.js` as a holistic script inside the `index.html`

```sh
npm i -D sass style-loader css-loader sass-loader
```
5. Then change `webpack.config.js`:
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
6. To generate automatically the HTML file:

```sh
npm i -D html-webpack-plugin
npm i -D webpack-dev-server
npm i -D babel-loader @babel/core @babel/preset-env
npm i axios
npm i webpack-bundle-analyzer
```
> The rest inside the video tutorial.
