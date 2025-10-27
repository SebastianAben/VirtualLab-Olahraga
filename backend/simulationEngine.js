const INTENSITY_TARGETS = {
  rest: { target: 80, min: 60, max: 95 },
  jog: { target: 135, min: 115, max: 154 },
  sprint: { target: 175, min: 155, max: 200 },
};

const EXERTION_STIFFNESS = 0.00000008;
const EXERTION_DAMPING = 0.08;
const RECOVERY_STIFFNESS = 0.00000004;
const RECOVERY_DAMPING = 0.05;

function getZoneFromHeartRate(hr) {
  if (hr < 95) return 'resting';
  if (hr < 115) return 'fat-burn';
  if (hr < 155) return 'cardio';
  return 'peak';
}

function updateSimulation(state, deltaTime) {
  const isExertion = state.targetHeartRate > state.currentHeartRate;
  const stiffness = isExertion ? EXERTION_STIFFNESS : RECOVERY_STIFFNESS;
  const damping = isExertion ? EXERTION_DAMPING : RECOVERY_DAMPING;

  const force = (state.targetHeartRate - state.currentHeartRate) * stiffness;

  let newVelocity = (state.heartRateVelocity || 0) + force * deltaTime;

  newVelocity *= (1 - damping);

  let newHeartRate = state.currentHeartRate + newVelocity * deltaTime;

  if (newHeartRate > state.maxHeartRate) {
    newHeartRate = state.maxHeartRate;
    newVelocity = 0;
  }

  if (newHeartRate < state.minHeartRate) {
    newHeartRate = state.minHeartRate;
    newVelocity = 0;
  }

  const newZone = getZoneFromHeartRate(newHeartRate);

  return {
    ...state,
    currentHeartRate: newHeartRate,
    heartRateVelocity: newVelocity,
    zone: newZone,
  };
}

function setIntensity(state, intensity) {
  const newTarget = INTENSITY_TARGETS[intensity];
  return {
    ...state,
    intensity,
    targetHeartRate: newTarget.target,
    minHeartRate: newTarget.min,
    maxHeartRate: newTarget.max,
  };
}

function calculateGrade(timeInZone, goalDuration) {
  const percentage = (timeInZone / goalDuration) * 100;

  if (percentage >= 100) return 'A';
  if (percentage >= 85) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

module.exports = {
  getZoneFromHeartRate,
  updateSimulation,
  setIntensity,
  calculateGrade,
};
