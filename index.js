import {stringify, parse} from './circular-json'

const Urlencode = function(params) {

  const searchParams = Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&')

  return searchParams
}

const UrlencodeHeader = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}

const POSTUrlencodeJSON = function(url='/', params={}){
  return new Promise(async function(resolve, reject){
    try {
      const options = {
        method: 'POST',
        headers: UrlencodeHeader,
        body: Urlencode(params)
      }
      const res = await fetch(url, options)
      const json = await res.json()
      resolve(json)
    } catch(e){
      reject(e)
    }
  })
}


const POSTRawJSON = function(url='/', params={}){
  return new Promise(async function(resolve, reject){
    try {
      const options = {
        method: 'POST',
        body: stringify(params),
        headers: {
          "Content-Type": "application/json"
        }
      }
      const res = await fetch(url, options)
      const json = await res.json()
      resolve(json)
    } catch(e){
      reject(e)
    }
  })
}

const GETJSON = function(url='/', query={}){
  return new Promise(async function(resolve, reject){
    try {
      const res = await fetch(`${url}?${Urlencode(query)}`)
      const json = await res.json()
      resolve(json)
    } catch(e){
      reject(e)
    }
  })
}

const DELETEJSON = function(url='/', query={}){
  return new Promise(async function(resolve, reject){
    try {
      const res = await fetch(url, {
        method: 'DELETE'
      })
      resolve(await res.json())
    } catch(e){
      reject(e)
    }
  })

}

const PUTJSON = function(url='/', query={}){
  return new Promise(async function (resolve, reject) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        form: Urlencode(query)
      })
    } catch(e){
      reject(e)
    }
  })
}


const Mock = function(mockData) {
  return new Promise(async function(resolve, reject) => {
    resolve(mockData)
  })
}


export {
  Mock,
  Urlencode,
  GETJSON,
  PUTJSON,
  POSTRawJSON,
  DELETEJSON,
  POSTUrlencodeJSON
}
