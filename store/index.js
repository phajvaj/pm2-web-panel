export const state = () => ({
  drawer: false
});

export const getters = {
  isAuthenticated(state) {
    return state.user.loggedIn
  },

  loggedInUser(state) {
    return state.user.user
  }
};

export const mutations = {
  SET_DRAWER(state, newVal){
    state.drawer = newVal;
  }
};
