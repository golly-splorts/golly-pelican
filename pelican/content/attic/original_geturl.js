var baseUIUrl = '';
var baseApiUrl = '';

function getBaseUIUrl() {
  if (baseUIUrl==='') {
    var protocol = window.location.protocol;
    var host = window.location.host;
    return protocol + '//' + host;
  } else {
    return baseApiUrl;
  }
}

function getBaseApiUrl() {
  if (baseApiUrl==='') {
    var protocol = window.location.protocol;
    var host = window.location.host;
    return protocol + '//api.' + host;
  } else {
    return baseApiUrl;
  }
}

