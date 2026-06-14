import { map1, map2, map3 } from './map.js';

const commonConfig = {
  theme: 3,
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  requiresPlayerSelection: true,
  coop: true,
};

export const rounds = [
  {
    map: map1,
    config: {
      ...commonConfig,
      narrativeKey: 'level3.narrative.0',
    }
  },
  {
    map: map2,
    config: {
      ...commonConfig,
      narrativeKey: 'level3.narrative.1',
    }
  },
  {
    map: map3,
    config: {
      ...commonConfig,
      narrativeKey: 'level3.narrative.2',
    }
  }
];

export const onBeforeBoxPush = (state, box, playerNum, dx, dy) => {
  if (!box.isHeavy) return { allowed: true };

  const otherPlayer = playerNum === 1 ? state.player2Pos : state.playerPos;

  const isOtherPlayerHelping =
    otherPlayer &&
    otherPlayer.r === box.r - dy &&
    otherPlayer.c === box.c - dx;

  if (!isOtherPlayerHelping) {
    return {
      allowed: false,
      errorTextKey: 'gameBoard.twoPlayersRequired',
      errorPos: { r: box.r, c: box.c }
    };
  }

  return { allowed: true };
};
