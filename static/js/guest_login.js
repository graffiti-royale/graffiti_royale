function guestLoginJavaScript () {
  /* globals fetch */
  const Cookies = require('cookies-js')

  let input = document.querySelector('#guest-name')
  document.querySelector('button').addEventListener('click', function () {
    let name = input.value
    fetch('/checkguestname/', {
      method: 'POST',
      body: JSON.stringify({ 'username': name }),
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json'
      } })
      .then(response => response.json())
      .then(function (data) {
        if (data['url']) {
          window.location.href = `https://${window.location.host}/${data['url']}/`
        } else {
          document.querySelector('h2').innerText = data['message']
        }
      })
  })
}

let onGuestLoginPage = document.querySelector('#guestlog')

if (onGuestLoginPage) {
  guestLoginJavaScript()
}
