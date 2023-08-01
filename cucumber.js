module.exports = {
  default: {
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    require: ['packages/**/features/**/*.ts'],
    paths: ['packages/**/features/**/*.feature'],
    publishQuiet: true
  }
};
