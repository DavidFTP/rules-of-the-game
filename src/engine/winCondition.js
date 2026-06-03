/**
 * checkWin(state)
 * Default win: every target has a box on it.
 * Levels can pass a custom winFn in their config to override.
 */
export function checkWin(state) {
  const { targets, boxes, config } = state;
  if (!targets || targets.length === 0) return false;

  // 1. Custom win function supplied by a level
  if (config?.winFn) return config.winFn(state);

  // 2. CHECK FOR ORDERED WIN!
  // Find the required order (either from the specific round state, or the global config)
  const order = state.requiredOrder || config?.requiredOrder;

  // ONLY enforce the strict order if the round has the exact same number of targets 
  // as the required order. This protects Round 1 and Round 2 from Round 3's rules!
  if (config?.enforceOrder && order && targets.length === order.length) {
    return checkOrderedWin(state, order);
  }

  // 3. Default win: just check if every target has ANY box on it
  return targets.every(t => boxes.some(b => b.r === t.r && b.c === t.c));
}
export function checkOrderedWin(state, requiredOrder) {
  // 1. Get all boxes currently sitting on targets
  const boxesOnTargets = state.boxes.filter(box => 
    state.targets.some(t => t.r === box.r && t.c === box.c)
  );

  // 2. If not all targets are physically filled, no win yet
  if (boxesOnTargets.length !== state.targets.length) return false;

  // --- 🕵️‍♂️ DEBUGGING LOGS ---
  console.log("✅ All targets physically filled!");
  console.log("🧠 Engine's Placed Order:", state.placedOrder);
  console.log("🎯 Required Order:", requiredOrder);

  // 3. Catch the missing array bug
  if (!state.placedOrder || state.placedOrder.length === 0) {
    console.error("🚨 BUG: state.placedOrder is empty or undefined! Your movement.js isn't tracking time.");
    return false;
  }

  // 4. Verify chronological order 
  // (We slice the end of the array in case the player pushed boxes on and off a few times)
  const recentPlacements = state.placedOrder.slice(-requiredOrder.length);

  for (let i = 0; i < requiredOrder.length; i++) {
    if (recentPlacements[i] !== requiredOrder[i]) {
      console.log(`❌ Failed: Expected ${requiredOrder[i]}, but got ${recentPlacements[i]}`);
      return false; // Wrong chronological order!
    }
  }

  console.log("🏆 ORDER CORRECT! WIN!");
  return true;
}