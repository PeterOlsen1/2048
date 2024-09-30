import { ModuleCacheMap } from "vite/runtime";

type Box = {
    value: number,
    row: number,
    col: number,
    id: number
}

enum Direction {
    Up,
    Down,
    Left,
    Right
}


export const state: (Box| undefined) [][] = [
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
];

state[0][0] = { value: 1, row: 0, col: 0, id: 0 }
state[1][1] = { value: 2, row: 1, col: 1, id: 1 }
state[1][2] = { value: 3, row: 1, col: 2, id: 3 }
state[1][3] = { value: 4, row: 1, col: 3, id: 4 }
state[3][3] = { value: 5, row: 3, col: 3, id: 5 }


/**
 * 
 * @param box {Box} the box we want to move on the grid
 * @param dir {Direction} the direction we want to move the box in
 * @returns In case the box cannot move
 * 
 * The purpose of this function is to move a box (if possible)
 * 
 * It works by selecting the box on the page, then checking the direction to move in.
 * If the spot we want to move to is already taken, then return to base case.
 * Otherwise, pull some trickery: I initially wanted to animate the
 * grid-col / grid-row properties, but css does not allow for that.
 * 
 * So, all boxes are at some top / left value away from the top left of their
 * intitial starting point.
 * 
 * They are spawed in the corresponding grid position, but move freely from there.
 * The downside to this approach is that the position of these boxes is not
 * relative, but solely based on pixels.
 */
export function move(box: Box, dir: Direction) {
    const node = document.querySelector<HTMLElement>(`#box-${box.id}`);

    if (!node) {
        return;
    }

    let mod: (() => void) = () => {console.log('hi')};
    let px: number;

    switch (dir) {
        case Direction.Up:
            if (box.row > 0) {
                if (!isOccupied(box.row - 1, box.col)) {
                    px = parseInt(node.style.top.split('px')[0]) || 0;
                    node.style.top = (px - 85) + 'px';

                    mod = () => {
                        box.row--;
                    }
                    break;
                }
            }
            //add returns at the bottom of these cases to stop unintended cases
            return;
        case Direction.Down:
            if (box.row < 3) {
                if (!isOccupied(box.row + 1, box.col)) {
                    px = parseInt(node.style.top.split('px')[0]) || 0;
                    node.style.top = (px + 85) + 'px';

                    mod = () => {
                        box.row++;
                    }
                    break;
                }
            }
            return;
        case Direction.Right:
            if (box.col < 3) {
                if (!isOccupied(box.row, box.col + 1)) {
                    px = parseInt(node.style.left.split('px')[0]) || 0;
                    node.style.left = (px + 85) + 'px';

                    mod = () => {
                        box.col++;
                    }
                    break;
                }
            }
            return;
        case Direction.Left:
            if (box.col > 0) {
                if (!isOccupied(box.row, box.col - 1)) {
                    px = parseInt(node.style.left.split('px')[0]) || 0;
                    node.style.left = (px - 85) + 'px';

                    mod = () => {
                        box.col--;
                    }
                    break;
                }   
            }
            return;
        default:
            return;
    }

    //run the mod function and update state correspondingly
    if (mod) {
        state[box.row][box.col] = undefined;
        mod();
        state[box.row][box.col] = box;
    }
}



/**
 * This function is essentially what makes the game run.
 * 
 * This is completed on mount on the page, and then listens for keypresses.
 * Sometimes, rows/cols are traversed in the opposite direction.
 * This is because we want to ensure that the proper boxes move first.
 * 
 * For example, moving the row [1, 2, 3, 0] right, we want to move in the order:
 *  3 -> 2 -> 1.
 * This is done becuase we want to move the righmost elements first
 * to avoid blocking other boxes
 */
export function setupEventListeners() {
    document.addEventListener('keypress', (event) => {
        let dir: Direction;
        switch (event.key) {
            case 'a':
                dir = Direction.Left;
                for (const row of state) {
                    for (const box of row) {
                        if (box) {
                            move(box, dir);
                        }
                    }
                }
                break;
            case 's':
                dir = Direction.Down;
                for (let i = 3; i >= 0; i--) {
                    const row = state[i];
                    for (const box of row) {
                        if (box) {
                            move(box, dir);
                        }
                    }
                }
                break;
            case 'd':
                dir = Direction.Right;
                for (const row of state) {
                    for (let i = 3; i >= 0; i--) {
                        const box = row[i];
                        if (box) {
                            move(box, dir);
                        }
                    }
                }
                break;
            case 'w':
                dir = Direction.Up;
                for (const row of state) {
                    for (const box of row) {
                        if (box) {
                            move(box, dir);
                        }
                    }
                }
                break;

            //debug key
            case 'q':
                for (const row of state) {
                    console.log(...row);
                }
                return;
            default:
                return;
        }
    });
}

function isOccupied(row: number, col: number) {
    if (state[row][col]) {
        return true;
    }
    return false;
}

function canMerge(row: number, col: number, dir: Direction) {

}