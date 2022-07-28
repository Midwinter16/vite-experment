import service from './request'

export const getUserInfo = (params: string) => {
  return service.get(`/userinfo/${params}`)
}

export const userLogin = (params?: object) => {
  return service.post('/login', params)
}

export const userRegister = (params: object) => {
  return service.post('/register', params)
}
