const { join } = require('path');
const { apply, url, template, move, mergeWith } = require('@angular-devkit/schematics');
const { strings } = require('@angular-devkit/core');

function multiComponent(options) {
  const name = strings.classify(options.name); // Brand, Social, Category...
  const basePath = `src/app/views/dashboard/${strings.dasherize(name)}s/${name}`;

  const templates = [
    { suffix: 'IndexPage', selector: `${strings.dasherize(name)}-index-page` },
    { suffix: 'Index', selector: `${strings.dasherize(name)}-index` },
    { suffix: 'EditPage', selector: `${strings.dasherize(name)}-edit-page` },
    { suffix: 'Edit', selector: `${strings.dasherize(name)}-edit` },
    { suffix: 'CreatePage', selector: `${strings.dasherize(name)}-create-page` },
    { suffix: 'Create', selector: `${strings.dasherize(name)}-create` }
  ];

  return (tree, _context) => {
    templates.forEach(tpl => {
      const source = apply(url('./files'), [
        template({
          ...strings,
          name,
          suffix: tpl.suffix,
          selector: tpl.selector
        }),
        move(join(basePath, `${name}${tpl.suffix}`))
      ]);
      tree = mergeWith(source)(tree, _context);
    });
    return tree;
  };
}

module.exports = { multiComponent };
