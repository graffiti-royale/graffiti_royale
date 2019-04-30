function guestLoginJavaScript () {
  /* globals fetch */
  const Cookies = require('cookies-js')
  let input = document.querySelector('#guest-name')
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  input.focus()
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      let name = input.value
      let check = true
      for (let letter of name) {
        if (!letters.includes(letter)) {
          check = false
        }
      }
      if (!check) {
        document.querySelector('h2').innerText = 'No special characters or spaces'
      } else if (name.length > 15) {
        document.querySelector('h2').innerText = 'Character limit is 15'
      } else {
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
      }
    }
  })

  document.querySelector('button').addEventListener('click', function () {
    let name = input.value
    let check = true
    for (let letter of name) {
      if (!letters.includes(letter)) {
        check = false
      }
    }
    if (!check) {
      document.querySelector('h2').innerText = 'No special characters or spaces'
    } else if (name.length > 15) {
      document.querySelector('h2').innerText = 'Character limit is 15'
    } else {
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
    }
  })
}

let onGuestLoginPage = document.querySelector('#guestlog')

if (onGuestLoginPage) {
  guestLoginJavaScript()
}
