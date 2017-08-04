import _ from 'lodash';

export default function getBreadcrumbs(path) {
  let breadcrumbs = [];
  let components = path.replace(/\/$/, "").split("/");

  _.forEach(components, function(component, index) {
    breadcrumbs.push({
      name: component,
      active: index == components.length - 1,
      path: "/" + components.slice(0, index + 1).join("/")
    })
  })

  return breadcrumbs;
}
