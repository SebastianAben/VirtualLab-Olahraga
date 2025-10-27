const challenges = [
  {
    id: 'cardio-endurance',
    name: 'Cardio Endurance',
    description: 'Stay in the Cardio zone (115-154 BPM) for 60s within a 90s period.',
    benefit:
      'This challenge trains your heart to work efficiently for sustained periods. Improving your cardio endurance is key for overall fitness, stamina, and long-term heart health.',
    targetZone: 'cardio',
    goalDuration: 60,
    totalDuration: 90,
  },
  {
    id: 'fat-burn-focus',
    name: 'Fat Burn Focus',
    description: 'Stay in the Fat Burn zone (95-114 BPM) for 3 minutes within a 4-minute period.',
    benefit:
      'This lower-intensity, longer-duration challenge trains your body to more effectively use fat as an energy source. It\'s great for building a strong aerobic base and improving metabolic health.',
    targetZone: 'fat-burn',
    goalDuration: 180, // 3 minutes
    totalDuration: 240, // 4 minutes
  },
  {
    id: 'peak-performance-intervals',
    name: 'Peak Performance Intervals',
    description: 'Push into the Peak zone (>155 BPM) for a total of 30 seconds within a 2-minute period.',
    benefit:
      'This high-intensity interval challenge is designed to significantly boost your VO2 max (the maximum amount of oxygen your body can use). It provides a powerful cardiovascular stimulus in a short amount of time.',
    targetZone: 'peak',
    goalDuration: 30,
    totalDuration: 120, // 2 minutes
  },
];

module.exports = challenges;
