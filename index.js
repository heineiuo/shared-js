import fetch from 'isomorphic-fetch'
import UrlEncode from "form-urlencoded"

class Fetch {
  constructor(url, params = {}, options={}) {
    this.args = Object.assign({
      debug: false,
      mode: 'json',
      extraError: {}
    }, options)
    this.url = url;
    this.params = params;
  }

  options = {
    headers: {}
  };

  params = (params, replace=false) => {
    this.params = replace ? params : Object.assign({}, this.params, params)
    return this;
  }

  mode = (mode) => {
    this.args.mode = mode;
    return this;
  }

  debug = (bool, extraError = {}) => {
    this.args.debug = bool;
    this.args.extraError = extraError;
    return this;
  }

  formData = (formData) => {
    this.formData = formData;
    this.bodyType = 'FormData'
    return this;
  }

  fetch = (method = 'POST') => new Promise(async (resolve, reject) => {
    let text = null;
    try {
      this.options.method = method.toUpperCase();

      if (this.bodyType === 'FormData') {
        const sepCode = this.url.search(/\?/) > 0 ? '&' : '?'
        this.url = `${this.url}${sepCode}${UrlEncode(this.params, {
          ignorenull : true,
          sorted : true
        })}`
        if (this.options.method === 'GET') return resolve({error: 'Form data must use POST method'})
        this.options.body = this.formData
      } else {
        if (this.args.mode === 'urlencoded') {
          this.options.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
          this.options.body = UrlEncode(this.params)
        } else {
          this.options.headers["Content-Type"] = "application/json"
          this.options.body = JSON.stringify(this.params)
        }

      }
      if (this.args.debug) console.log(`fetch: ${this.url}`)
      const res = await fetch(this.url, this.options)
      text = await res.text()
      const json = JSON.parse(text)
      resolve(json)
    } catch (e) {
      if (this.args.debug) {
        console.log(
          `
fetch: server response is not JSON format, please check:
===text start===
${text}
===text end===
`
        )
      }
      resolve(Object.assign({}, this.args.extraError, {error: e.name, message: e.message}))
    }
  })

  post = () => this.fetch('POST')
  put = () => this.fetch('PUT')
  get = () => this.fetch('GET')
}

export {UrlEncode}
export default (...props) => new Fetch(...props)

