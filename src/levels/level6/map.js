// W = Wall (#), P = Player, B = Box, T = Target, E = Door

// MAP 1: The Choice Room 
export const choiceMap = [
  '#############',
  '##         ##',
  '#           #',
  'E     P     E', 
  '#           #',
  '##         ##',
  '#############',
];

// MAP 2: The World's Puzzle (Wrong Path)
export const leftPuzzleMap = [
  '##########',
  '#        #',
  '# T    T #',
  '#        #',
  '#  B  B  #',
  '#   P    #',
  '##########',
];

// MAP 3: The True Puzzle (Right Path)
export const rightPuzzleMap = [
  '############',
  '#          #',
  '#  T    T  #',
  '#          #',
  '#  B    B  #',
  '#    P     #',
  '############',
];