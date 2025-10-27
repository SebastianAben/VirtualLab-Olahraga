const INTENSITY_TARGETS = {
  rest: { target: 80 },
  jog: { target: 135 },
  sprint: { target: 175 },
};

const MIN_HEART_RATE = 50;
const MAX_HEART_RATE = 200;
const EXERTION_RESPONSE_TIME = 1.8; // seconds to reach ~63% toward target
const RECOVERY_RESPONSE_TIME = 3.2; // slower return when cooling down

function getZoneFromHeartRate(hr) {
  if (hr < 95) return 'resting';
  if (hr < 115) return 'fat-burn';
  if (hr < 155) return 'cardio';
  return 'peak';
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateSimulation(state, deltaTimeMs) {
  const dt = Math.max(deltaTimeMs, 0) / 1000;
  if (dt === 0) {
    return state;
  }

  const isExertion = state.targetHeartRate > state.currentHeartRate;
  const responseTime = isExertion ? EXERTION_RESPONSE_TIME : RECOVERY_RESPONSE_TIME;

  const alpha = 1 - Math.exp(-dt / responseTime);
  const interpolatedHeartRate =
    state.currentHeartRate + (state.targetHeartRate - state.currentHeartRate) * alpha;

  const newHeartRate = clamp(interpolatedHeartRate, MIN_HEART_RATE, MAX_HEART_RATE);
  const newVelocity = (newHeartRate - state.currentHeartRate) / dt;
  const newZone = getZoneFromHeartRate(newHeartRate);

  return {
    ...state,
    currentHeartRate: newHeartRate,
    heartRateVelocity: newVelocity,
    zone: newZone,
  };
}

function setIntensity(state, intensity) {
  const nextConfig = INTENSITY_TARGETS[intensity] || INTENSITY_TARGETS[state.intensity] || INTENSITY_TARGETS.rest;
  const nextIntensity = INTENSITY_TARGETS[intensity] ? intensity : state.intensity;
  return {
    ...state,
    intensity: nextIntensity,
    targetHeartRate: nextConfig.target,
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
