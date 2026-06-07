// W = Wall (#), P = Player, B = Box, T = Target

// Round 1: A simple room.
export const r1Map = [
  '########',
  '#      #',
  '#      #',
  '# P B T#',
  '#      #',
  '########',
];

// Round 2: The "River" Room. 
// They will have to pace up and down in the space below the box 7 times!
export const r2Map = [
  '#######',
  '#  T  #',
  '#  B  #',
  '#  P  #',
  '#     #',
  '#     #',
  '#######',
];

// Round 3: The Long Way Around
export const r3Map = [
  '########',
  '#  T   #',
  '#      #',
  '#  B   #',
  '# P    #',
  '########',
];