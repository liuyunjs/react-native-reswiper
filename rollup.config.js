import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

// const v1 = {
//   input: './library1/index.ts',
//   output: {
//     file: './v1/index.js',
//     format: 'es',
//     exports: 'named',
//   },
//   plugins: [
//     typescript({
//       typescript: require('typescript'),
//       tsconfigOverride: {
//         include: ['./library1'],
//         compilerOptions: {
//           outDir: './v1',
//         },
//       },
//     }),
//   ],
// };

const v2 = {
  input: './library/main.ts',
  output: {
    file: pkg.main,
    format: 'es',
    exports: 'named',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        include: ['./library'],
        compilerOptions: {
          outDir: './dist',
        },
      },
    }),
  ],
};

export default [v2];
