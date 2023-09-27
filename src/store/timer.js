// store/timer.js

const state = {
  showSendBtnFlag: true,
  countdown: 60,
  timer: null
};

const mutations = {
  setShowSendBtnFlag(state, flag) {
    state.showSendBtnFlag = flag;
  },
  setCountdown(state, value) {
    state.countdown = value;
  },
  setTimer(state, timer) {
    state.timer = timer;
  }
};

const actions = {
  startTimer({ commit }) {
    commit('setShowSendBtnFlag', false);

    const timer = setInterval(() => {
      if (state.countdown > 0) {
        commit('setCountdown', state.countdown - 1);
      } else {
        commit('setShowSendBtnFlag', true);
        clearInterval(state.timer);
        commit('setTimer', null);
        commit('setCountdown', 60);
      }
    }, 1000);

    commit('setTimer', timer);
  },
  stopTimer({ commit }) {
    if (state.timer) {
      clearInterval(state.timer);
      commit('setTimer', null);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
