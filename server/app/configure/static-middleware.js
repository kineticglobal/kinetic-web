"use strict";
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');

module.exports = function (app) {

    const root = app.getValue('projectRoot');

    const npmPath = path.join(root, './node_modules');
    const publicPath = path.join(root, './public');
    const browserPath = path.join(root, './browser');
    const imagesPath = path.join(root, './images');

    app.use(favicon(app.getValue('faviconPath')));
    app.use(compression());
    app.use(express.static(npmPath));
    app.use(express.static(publicPath));
    app.use(express.static(browserPath));
    app.use(express.static(imagesPath));

};
