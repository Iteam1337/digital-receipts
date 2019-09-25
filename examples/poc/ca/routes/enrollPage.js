function parseJwt(token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

module.exports = (req, res) => {
  const { success, tutorial, token } = req.query

  res.send(`
  <h2 style="color: rgb(135, 129, 211)">Registrera mig som kvittoutgivare</h2>
  <form action="/enroll-publisher" method="POST">
  <label for="publisher-org-id"> Org Id utgivare </label>
  <br>
  <input ${
    tutorial ? 'readonly' : ''
  } name="organizationId" id="publisher-org-id" type="input" value="${
    process.env.PUBLISHER_ORG_ID
  }"/>
  <br>

  <label for="publisher-txt-keys-number"> Generate some keys </label>
  <br/>
  <input type="text" value="1" id="publisher-txt-keys-number"/>
  <input type="button" value="Generera nycklar" onclick="generateKeys('publisher')"/>
  <pre id="publisher-keys-container"></pre>
  <input type="hidden" id="publisher-input-keys" name="keys"/>
  <br>
  <input type="submit" value="Registrera"/>
  </form>

  <h2 style="color: rgb(135, 129, 211)">Registrera mig som konterare</h2>
  <form action="/enroll-reporter" method="POST">
  <label for="reporter-org-id"> Org Id utgivare </label>
  <br>
  <input ${
    tutorial ? 'readonly' : ''
  } name="organizationId" id="reporter-org-id" type="input" value="${
    process.env.USER_ACCOUNTING_ORG_ID
  }"/>
  <br>

  <label for="reporter-txt-keys-number"> Generate some keys </label>
  <br/>
  <input type="text" value="1" id="reporter-txt-keys-number"/>
  <input type="button" value="Generera nycklar" onclick="generateKeys('reporter')"/>
  <pre id="reporter-keys-container"></pre>
  <input type="hidden" id="reporter-input-keys" name="keys"/>
  <br>
  <input type="submit" value="Registrera"/>
  </form>

  ${
    success === undefined
      ? ``
      : success === 'true'
      ? `<div id="success-msg" style="color: green; font-size:30px; top:16px; left: 25px; z-index: 11;"> Ditt företag är nu registrerat! Spara ditt token ${token} &#9989</div>`
      : `<div style="color: red" id="success-msg"> Den här organisationen är redan registrerad.`
  }

  <script>
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      localStorage.setItem('token', token)
    }
    let keys
    window.onmessage = function (e) {
      var payload = JSON.parse(e.data);
      localStorage.setItem(payload.key, payload.data);
    };
    setTimeout(() => {
      const successMsgElement = document.getElementById(
        'success-msg'
      )
      if (successMsgElement) {
        successMsgElement.innerHTML = ''
      }
    }, 3500)

    function generateKeys (type) {
      const keyNumber = document.getElementById(type + '-txt-keys-number').value
      fetch('/keys?total=' + keyNumber)
        .then(res => res.json())
        .then(data => {
          document.getElementById(type + '-input-keys').value = JSON.stringify(data)
          document.getElementById(type + '-keys-container').innerHTML = data.map(({ publicKey }) => publicKey).join('\\n')
        })
    }
  </script>
  `)
}
