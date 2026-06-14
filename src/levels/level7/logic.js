export const map = [
  '#############',
  '#...........#',
  '#..T.....T..#',
  '#...........#',
  '#...CC......#',
  '#...........#',
  '#..Bg....Bs.#',
  '#.....P.....#',
  '#...........#',
  '#############',
]

export const boxes = [
  { r: 6, c: 3, type: 'gold',   id: 'box-gold',   value: 100 },
  { r: 6, c: 8, type: 'silver', id: 'box-silver',  value: 10  },
]

export const targets = [
  { r: 2, c: 3 },
  { r: 2, c: 8 },
]

export const crackPositions = [
  { r: 4, c: 4 },
  { r: 4, c: 5 },
]

export const playerStart = { r: 7, c: 6 }

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  narrativeKey: 'level7.narrative',
  crackTrigger: 'gold',
}
