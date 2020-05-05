module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: '11',
        },
        useBuiltIns: 'entry',
        corejs: 3,
        debug: false,
      },
    ],
  ];

  return {
    presets,
  };
};
