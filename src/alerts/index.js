const previousState = require('./previous-state');
const CurrentSlots = require('./current-slots');
const Login = require('./login');

const alerts = () => {
  return previousState.get()
    .then((previousStateData) => {
      const previousSlots = previousStateData.slots;
      console.log('Got previous state: ', previousSlots);
      return CurrentSlots.currentSlots(previousStateData.loginDetails)
        .then((slots) => {
          console.log('Got current slots: ', slots);
          return previousState.update({
            loginDetails: previousStateData.loginDetails,
            slots: slots
          }).then(() => {
            const {newSlots, withdrawnSlots} = compareSlots(slots, previousSlots);
            if(newSlots) console.log('newSlots found ', newSlots);
            if(withdrawnSlots) console.log('withdrawnSlots', withdrawnSlots);
            return {newSlots, withdrawnSlots};
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
  console.log('Trying to relogin');
  return Login.login().then((loginDetails) => {
    console.log('Login success');
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
    && (parseInt(currentSlots[slot]['left']) != 0)
  })
}

module.exports = {alerts};