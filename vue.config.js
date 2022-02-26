module.exports = {
   pwa: {
      themeColor: '#faa500',
      msTileColor: '#faa500',
      name: 'LoR MU Table',
      workboxOptions: {
         exclude: [/\.map$/, /_redirects/],
      },
   },
   css: {
      loaderOptions: {
         sass: {
            // import sass variables for each file
            prependData: '@import "@/_variables.scss";',
         },
      },
   },
};
