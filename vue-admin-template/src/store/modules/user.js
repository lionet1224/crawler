import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getScope } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  let data = getToken();
  return {
    token: data.token,
    refresh_token: data.refresh_token,
    uid: '',
    name: '',
    avatar: '',
    scope: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refresh_token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_SCOPE: (state, scope) => {
    state.scope = scope
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.auth.token)
        commit('SET_REFRESH_TOKEN', data.auth.refresh_token)
        setToken(data.auth)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { username, portrait, uid, scope } = data

        if(scope < getScope().ADMIN){
          reject('No access to the background, please Login again.')
        }

        commit('SET_NAME', username)
        commit('SET_AVATAR', portrait)
        commit('SET_UID', uid)
        commit('SET_SCOPE', scope)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

