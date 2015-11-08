const pffSounds = [1,2,3].map(i => new Audio(`sounds/pf${i}.mp3`));
const pffSoundsCount = pffSounds.length;
// const crrSound = new Audio('sounds/crr.mp3');
// const gameOverSound = new Audio('sounds/gameover.mp3');

const randi = limit => ~~(Math.random() * limit);
export const playRandomPfSound = () => pffSounds[randi(pffSoundsCount)].play();
