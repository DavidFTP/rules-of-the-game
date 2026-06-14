import { map1, map2, map3 } from './map.js';

const commonConfig = {
  theme: 3,
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  requiresPlayerSelection: true,
  coop: true, // Ensures WASD is active for P2
};

export const rounds = [
  {
    map: map1,
    config: {
      ...commonConfig,
      narrativeText: 'Round 1: A humble start. You can move this box easily.',
    }
  },
  {
    map: map2,
    config: {
      ...commonConfig,
      narrativeText: 'Round 2: This box is too heavy for pride. Work together!',
    }
  },
  {
    map: map3,
    config: {
      ...commonConfig,
      narrativeText: 'Round 3: Double the burden. Stay humble and coordinate!',
    }
  }
];

// Hook triggered right before a player pushes a box.
export const onBeforeBoxPush = (state, box, playerNum, dx, dy) => {
  if (!box.isHeavy) return { allowed: true };

  // (We deleted the solo bypass rule here!)

  // Check if the OTHER player is on the EXACT SAME TILE
  const otherPlayer = playerNum === 1 ? state.player2Pos : state.playerPos;
  
  const isOtherPlayerHelping = 
    otherPlayer &&
    otherPlayer.r === box.r - dy && 
    otherPlayer.c === box.c - dx;

  // Reject the push if they are trying to do it alone
  if (!isOtherPlayerHelping) {
    return { 
      allowed: false, 
      errorText: '2 Players Required!', 
      errorPos: { r: box.r, c: box.c } 
    };
  }

  return { allowed: true };
};