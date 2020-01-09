var deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function (err) {
      console.log(err);
    });

  window.addEventListener('beforeinstallprompt', function (event) {
    console.log('beforeinstallprompt fired');

    event.preventDefault();
    deferredPrompt = event;

    return false;
  })
};

fetch('https://httpbin.org/ip')
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

fetch('https://httpbin.org/post', {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors',
  body: JSON.stringify({ messaje: 'Does this work?' })
})
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

var promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    //resolve('This is excecuted once the timer is done!');
    reject({ code: 500, messaje: 'An error ocurred!' });
    //console.log('This is excecuted once the timer is done!');
  }, 3000);
});

// promise
//   .then(
//     function (text) {
//       return text;
//     },
//     function (err) {
//       console.log(err.code, err.messaje);
//     })
//   .then(function (newText) {
//     console.log(newText);
//   });

promise
  .then(
    function (text) {
      return text;
    })
  .then(function (newText) {
    console.log(newText);
  })
  .catch(function (err) {
    console.log(err.code, err.messaje);
  });

console.log('This is excecuted right after setTiemout()');