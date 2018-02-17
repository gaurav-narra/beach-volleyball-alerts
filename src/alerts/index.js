const previousState = require('./previous-state');
const CurrentSlots = require('./current-slots');
const Login = require('./login');

const alerts = () => {
  return previousState.get()
    .then((previousStateData) => {
      const previousSlots = previousStateData.slots;
      return CurrentSlots.currentSlots(previousStateData.loginDetails)
        .then((slots) => {
          return previousState.update({
            loginDetails: previousStateData.loginDetails,
            slots: slots
          }).then(() => {
            return compareSlots(slots, previousSlots);
          })
        })
        .catch(() => {
          return reLogin();
        })
    })
    .catch(() => {
      return reLogin();
    })
}

const reLogin = () => {
  return Login.login().then((loginDetails) => {
    return CurrentSlots.currentSlots(loginDetails).then((slots) => {
      return previousState.update({loginDetails, slots}).then(() => {
        return compareSlots({}, {});
      })
    })
  })
}

const compareSlots = (currentSlots, previousSlots) => {
  return {
    newSlots: newSlots(currentSlots, previousSlots),
    withdrawnSlots: withdrawnSlots(currentSlots, previousSlots)
  }
}


const newSlots = (currentSlots, previousSlots) => {
  return Object.keys(currentSlots).filter((slot) => !Object.keys(previousSlots).includes(slot))
}

const withdrawnSlots = (currentSlots, previousSlots) => {
  return Object.keys(currentSlots).filter(slot => {
    return previousSlots[slot] && currentSlots[slot]
    && (parseInt(previousSlots[slot]['left']) == 0)
    && (parseInt(currentSlots[slot]['left']) != '0')
  })
}

module.exports = {alerts};