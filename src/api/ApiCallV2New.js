// import swal from 'sweetalert2'
import axios from 'axios'
import { BASE_URL_V2 } from '../constants'

axios.defaults.baseURL = BASE_URL_V2
axios.defaults.headers.common.token = localStorage.getItem('token')

const Axios = axios.create({
  baseURL: BASE_URL_V2,
})

//konreg
export const konregSyncAll = function (params) {
  return new Promise((resolve, reject) => {
    Axios.get('/konreg/sync-pool', {
      params,
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const konregSyncUsulan = function (usulanId) {
  return new Promise((resolve, reject) => {
    Axios.get(`/konreg/sync-single-pool/${usulanId}`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const addKonreg = function (id, formdata) {
  return new Promise((resolve, reject) => {
    Axios.put(`/konreg/add-to-pool/${id}`, formdata)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getPenetapan = function (params) {
  return new Promise((resolve, reject) => {
    Axios.get('/penetapan', {
      data: params,
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
