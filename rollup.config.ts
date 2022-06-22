import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import postcss from "rollup-plugin-postcss";
import image from '@rollup/plugin-image';
import nested from 'postcss-nested'; // 处理less
import cssnano from 'cssnano';

export default defineConfig({
  input: './src/main.ts',
  output: {
    format: 'umd',
    file: './dist/lib.js',
    name: 'epc-hook-components',
    sourcemap: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '@emotion/styled': 'styled',
      'lodash': 'lodash',
      'classnames': 'classnames',
    }
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
    image(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      preventAssignment: false,
    }),
    postcss({
      use: { less: { javascriptEnabled: true }, sass: null, stylus: null },
      plugins: [
        nested(),
        cssnano(),
      ],
      extensions: [".css",'.less'],
      extract: false,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
      presets: ['@babel/env', '@babel/preset-react'],
      plugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
      // plugins: ["@emotion"],
    }),
    commonjs({ include: 'node_modules/**' }),
    terser(),
  ],
  external: ['react', 'react-dom', '@emotion/styled', 'lodash', 'classnames'],
  onwarn(warning, warn) {
    if (warning.id && warning.id.includes('node_modules')) return;
    if (warning.importer && warning.importer.includes('node_modules')) return;
    warn(warning)
  }
})
