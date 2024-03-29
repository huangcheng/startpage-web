module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  printWidth: 120,
  singleQuote: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'babel-ts',
      },
    },
  ],
};
