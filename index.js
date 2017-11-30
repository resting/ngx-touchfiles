const inquirer = require('inquirer');
const util = require('util');
const changeCase = require('change-case');
const fs = require('fs');

const currentDir = process.cwd();
const dirname = __dirname;
const questions = [
  {
    type   : 'input',
    name   : 'componentName',
    message: 'Enter component name (eg:MyOwnComponent = MyOwn): '
  },
  {
    type   : 'input',
    name   : 'cont',
    message: `Boilerplates will be created in (${currentDir}) continue? (y to continue): `
  }
];
const files = ['module.ts', 'component.ts', 'component.html',
  'component.scss', 'routing.ts'];
let componentName = '';
let componentNameParam = '';
let componentNameCamel = '';

inquirer.prompt(questions).then(r => {
  if ( r.comopnentName === '' || r.cont !== 'y' ) process.exit();

  componentName = r.componentName;
  componentNameParam = changeCase.paramCase(r.componentName);
  componentNameCamel = changeCase.camelCase(r.componentName);

  readFile = util.promisify(fs.readFile);
  writeFile = util.promisify(fs.writeFile);
  Promise.all(files.map(f => {
    const fullPath = currentDir + '/' + componentNameParam + '.' + f;

    return readFile(dirname + '/templates/' + f, 'utf8').then(d => {
      let content = d.replace(/\$\$componentName\$\$/g, componentName);
      content = content.replace(/\$\$componentNameParam\$\$/g, componentNameParam);
      content = content.replace(/\$\$componentNameCamel\$\$/g, componentNameCamel);
      return writeFile(fullPath, content).then(d => {
        return Promise.resolve(f);
      }).catch(e => {
        throw e;
      });
    }).catch(e => {
      throw e;
    });
  })).then(v => {
    if ( v.length === 5 ) {
      console.log('Files created');
      process.exit();
    }
  });
});
