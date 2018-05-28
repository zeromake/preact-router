const rollupTypescript = require('rollup-plugin-typescript')
const pkg = require('./package.json')
const { terser } = require('rollup-plugin-terser')
const replace = require('rollup-plugin-replace')
const alias = require('rollup-plugin-alias')
const path = require("path")

const isProduction = process.env.NODE_ENV === 'production'

const isReact = process.env.REACT === 'react'
const reactStr = process.env.REACT

const replacePlugin = replace({
    REACT: JSON.stringify(process.env.REACT),
    ENV: JSON.stringify(process.env.NODE_ENV)
})
const aliasPlugin = alias({
    resolve: ['.ts'],
    'react-import': path.resolve('./src/import/' + reactStr + '-import')
})
const rollupTypescriptPlugin = rollupTypescript({
    typescript: require('typescript')
})

const basePlugins = [
    aliasPlugin,
    rollupTypescriptPlugin,
    replacePlugin
]
if (isProduction) {
    basePlugins.push(terser())
}
const external = [reactStr]
let globals = {
    [reactStr]: reactStr
}
if (isReact) {
    globals = {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
    external.push('react-dom')
}

module.exports = {
    input: 'src/index.ts',
    external: external,
    plugins: basePlugins,
    output: isProduction ? [
        {
            name: 'router',
            sourcemap: !isProduction,
            globals: globals,
            format: 'umd',
            file: pkg["minified:main"].replace("zreact", reactStr)
        }
    ] : [
        {
            name: 'router',
            sourcemap: !isProduction,
            globals: globals,
            format: 'umd',
            file: pkg.main.replace("zreact", reactStr)
        },
        {
            name: 'router',
            sourcemap: !isProduction,
            globals: globals,
            format: 'es',
            file: pkg.module.replace("zreact", reactStr)
        }
	]
}
