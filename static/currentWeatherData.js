function CurrentWeatherDataOptions(options) {
  this.options = options;

  if (!options.hasOwnProperty('url'))
    options.url = 'https://api.openweathermap.org/data/2.5/weather';
}

CurrentWeatherDataOptions.prototype.go = function() {
  const options = this.options;

  return new Promise(function(fulfill, reject) {
    if (!formatLocationUrl(options)) {
      reject('currentWeatherData call is invalid.');
      return;
    }

    fetchResponse(options, fulfill, reject);
  });

  function addOptionalParameter(options, name) {
    if (options.hasOwnProperty(name))
      addParameter(options, name);
  }

  function addParameter(options, name, value) {
    options.url += options.hasParameters ? '&' : '?';
    options.url += name + '=' + encodeURIComponent(value || options[name]);
    options.hasParameters = true;
  }

  function fetchResponse(options, fulfill, reject) {
    fetch(options.url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin'
    })
    .then(function(response) {
      parseResponse(response, fulfill, reject);
    })
    .catch(function(error) {
      reject(error);
    });
  }

  function formatLocationUrl(options) {
    if (!hasOwnProperties(options, [ 'appid', 'lat', 'lon' ]))
      return false;

    addParameter(options, 'lat', options.lat);
    addParameter(options, 'lon', options.lon);
    addOptionalParameter(options, 'units');
    addParameter(options, 'appid');
    return true;
  }

  function hasOwnProperties(options, properties) {
    if (options == null)
      return false;

    for(const property of properties)
      if (!options.hasOwnProperty(property))
        return false;

    return true;
  }

  function parseResponse(response, fulfill, reject) {
    response
      .json()
      .then(function(obj) {
        if (!obj.hasOwnProperty('error'))
          fulfill(obj);
        else
          reject(obj.error.description);
      })
      .catch(function(error) {
        reject(error);
      });
  }
}

function currentWeatherData(options) {
  return new CurrentWeatherDataOptions(options);
}
