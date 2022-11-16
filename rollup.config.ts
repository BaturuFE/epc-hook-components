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
  output: [{
    format: 'cjs',
    file: './dist/lib.js',
    name: 'epc-hook-components',
    sourcemap: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'lodash': 'lodash',
      'classnames': 'classnames',
      '@emotion/styled': 'styled',
      '@emotion/react': 'emotionReact',
    }
  }, {
    format: 'esm',
    file: './dist/lib.esm.js',
    name: 'epc-hook-components',
    sourcemap: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'lodash': 'lodash',
      'classnames': 'classnames',
      '@emotion/styled': 'styled',
      '@emotion/react': 'emotionReact',
    }
  }],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
    image(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
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
      plugins: [
        ['@emotion'],
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
      ],
    }),
    commonjs({ include: 'node_modules/**' }),
    terser({ format: { comments: false } }),
  ],
  external: ['react', 'react-dom', 'lodash', 'classnames', '@emotion/styled', '@emotion/react'],
  onwarn(warning, warn) {
    if (warning.id && warning.id.includes('node_modules')) return;
    if (warning.importer && warning.importer.includes('node_modules')) return;
    warn(warning)
  }
})
