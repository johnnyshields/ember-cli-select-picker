module.exports = {
  name: 'gh-pages-post-build',
  postBuild: function (results) {
    var fs = this.project.require('fs-extra');
    fs.copySync(results.directory + '/index.html', './index.html');
  }
};
