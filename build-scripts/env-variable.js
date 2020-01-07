/* eslint-disable no-template-curly-in-string */

const dayjs = require('dayjs');

// 添加构建时间
process.env.VUE_APP_BUILD_TIME = dayjs().format('YYYY-MM-DD HH:mm');

const isMobileMode = process.env.VUE_APP_MOBILE_MODE === 'true';
let isProduction = process.env.NODE_ENV === 'production';

if (isMobileMode) {
  if (process.env.npm_lifecycle_event === 'build') {
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
    isProduction = true;
  }

  Object.keys(process.env)
    .filter(key => key.startsWith('VUE_APP_MOBILE_DEV_'))
    .forEach((key) => {
      if (!isProduction) {
        process.env[key.replace('DEV_', '')] = process.env[key];
      }
      delete process.env[key];
    });
} else {
  process.env.VUE_APP_MOBILE_MODE = 'false';
}

const MOBILE_ENV = {
  PUBLIC_PATH: './',

  VUE_APP_FREEMARKER_INJECT: (
    '<script>'
    + `var contextPath = "${process.env.VUE_APP_MOBILE_BASE_URL}";`
    + 'var currentUserCode = "";'
    + 'var currentUsername = "";'
    + 'var currentSystemType = "dpboot";'
    + '</script>'
  ),

  VUE_APP_FREEMARKER_BEGIN: '',

  VUE_APP_FREEMARKER_END: '',
};

const PRODUCTION_ENV = {
  PUBLIC_PATH: '${contextPath}/vue-project',

  VUE_APP_FREEMARKER_INJECT: (
    '<script>'
    + 'var contextPath = "${contextPath}";'
    + 'var currentUserCode = "${userCode}";'
    + 'var currentUsername = "${username}";'
    + 'var currentSystemType = "${systemType}";'
    + '</script>'
  ),

  VUE_APP_FREEMARKER_BEGIN: '<!-- <#escape x as x?html> <#assign contextPath=request.contextPath /> -->',

  VUE_APP_FREEMARKER_END: '<!-- </#escape> -->',
};

const DEVELOPMENT_ENV = {
  PUBLIC_PATH: '/',

  VUE_APP_FREEMARKER_INJECT: (
    '<script>'
    + 'var contextPath = "";'
    + 'var currentUserCode = sessionStorage.getItem("currentUserCode") || "204900";'
    + 'var currentUsername = sessionStorage.getItem("currentUsername") || currentUserCode || "用户名";'
    + `var currentSystemType = "${process.env.SYSTEM_TYPE}";`
    + '</script>'
  ),

  VUE_APP_FREEMARKER_BEGIN: '',

  VUE_APP_FREEMARKER_END: '',
};

if (isMobileMode) {
  Object.assign(process.env, MOBILE_ENV);
} else {
  if (isProduction) {
    process.env.SYSTEM_TYPE = (process.env.npm_lifecycle_script || '').includes('old-dg') ? 'dg' : 'dpboot';
  }
  Object.assign(process.env, isProduction ? PRODUCTION_ENV : DEVELOPMENT_ENV);
}
