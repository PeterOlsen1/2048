import { ModuleCacheMap } from "vite/runtime";
import { writable, get } from "svelte/store";

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


export const state = writable<(Box | undefined) [][]> ([
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
]);

const ids: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

//get the writable and update it when necessary
//update it using the state.set(currentState) method
const currentState = get(state);
currentState[0][0] = { value: 1, row: 0, col: 0, id: 0 }
currentState[0][3] = { value: 1, row: 0, col: 3, id: 1 }
// state[1][2] = { value: 3, row: 1, col: 2, id: 3 }
// state[1][3] = { value: 4, row: 1, col: 3, id: 4 }
// state[3][3] = { value: 5, row: 3, col: 3, id: 5 }
// state[2][0] = { value: 6, row: 2, col: 0, id: 6 }
// state[2][1] = { value: 7, row: 2, col: 1, id: 7 }


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
 * 
 * TODO: tackle moving multiple spaces at once
 */
export function move(box: Box, dir: Direction) {
    const node = document.querySelector<HTMLElement>(`#box-${box.id}`);

    if (!node) {
        return;
    }

    let mod: (() => void) = () => {};
    let px: number;

    switch (dir) {
        case Direction.Up:
            if (box.row > 0) {
                let row = box.row;
                while (row > 0 && !isOccupied(row - 1, box.col)) {
                    row--;
                }

                //it is possible that the while loop didn't move 'row'
                //but the box still can move there.
                if (row != box.row - 1 || !isOccupied(row, box.col)) {
                    px = parseInt(node.style.top.split('px')[0]) || 0;
                    node.style.top = (px - (85 * (box.row - row))) + 'px';

                    mod = () => {
                        box.row = row;
                    }
                    break;
                }
            }
            //add returns at the bottom of these cases to stop unintended cases
            return;
        case Direction.Down:
            if (box.row < 3) {
                let row = box.row;
                while (row < 3 && !isOccupied(row + 1, box.col)) {
                    row++;
                }
                if (row != box.row + 1 || !isOccupied(row, box.col)) {
                    px = parseInt(node.style.top.split('px')[0]) || 0;
                    node.style.top = (px + (85 * (row - box.row))) + 'px';

                    mod = () => {
                        box.row = row;
                    }
                    break;
                }
            }
            return;
        case Direction.Right:
            if (box.col < 3) {
                let col = box.col;
                while (col < 3 && !isOccupied(box.row, col + 1)) {
                    col++;
                }
                let box2;
                if (col != 3) {
                    box2 = currentState[box.row][col + 1];
                }

                if (col != 3 && isOccupied(box.row, col + 1) && box2 && box2.value == box.value) {
                    console.log("match!");
                    px = parseInt(node.style.left.split('px')[0]) || 0;
                    node.style.left = (px + (85 * (col + 1 - box.col))) + 'px';

                    mod = () => {
                        // currentState[box.row][box.col] = undefined;
                    }
                }

                else if (col != box.col + 1 || !isOccupied(box.row, col)) {
                    px = parseInt(node.style.left.split('px')[0]) || 0;
                    node.style.left = (px + (85 * (col - box.col))) + 'px';

                    mod = () => {
                        box.col = col;
                    }
                    break;
                }
                // else if (col != 3 && isOccupied(box.row, col)) {
                //     const box2 = currentState[box.row][col + 1];
                //     if (box2 && box2.value == box.value) {
                //         console.log("match!");
                //     }
                // }
            }
            return;
        case Direction.Left:
            if (box.col > 0) {
                let col = box.col;
                while (col > 0 && !isOccupied(box.row, col - 1)) {
                    col--;
                }
                if (col != box.col - 1 || !isOccupied(box.row, col)) {
                    px = parseInt(node.style.left.split('px')[0]) || 0;
                    node.style.left = (px - (85 * (box.col - col))) + 'px';

                    mod = () => {
                        box.col = col;
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
        currentState[box.row][box.col] = undefined;
        mod();
        currentState[box.row][box.col] = box;
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
                for (const row of currentState) {
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
                    const row = currentState[i];
                    for (const box of row) {
                        if (box) {
                            move(box, dir);
                        }
                    }
                }
                break;
            case 'd':
                dir = Direction.Right;
                for (let i = 0; i < 3; i++) {
                    const row = currentState[i];
                    for (let j = 3; j >= 0; j--) {
                        const box = row[j];
                        if (box) {
                            move(box, dir);
                        }
                    }
                    // merge(i, 0, dir);
                    return;
                }
                break;
            case 'w':
                dir = Direction.Up;
                for (const row of currentState) {
                    for (const box of row) {
                        if (box) {
                            move(box, dir);
                        }
                    }
                }
                break;

            //debug key
            case 'q':
                for (const row of currentState) {
                    console.log(...row);
                }
                return;
            default:
                return;
        }
    });
}

function isOccupied(row: number, col: number) {
    if (currentState[row][col]) {
        return true;
    }
    return false;
}

function merge(row: number, col: number, dir: Direction) {
    switch (dir) {
        case (Direction.Left):
        case (Direction.Right):
            const cur = currentState[row];
            console.log(cur);
            for (let i = 0; i < 3; i++) {
                if (cur[i] && cur[i + 1]) {
                    cur[i + 1].value += cur[i].value;
                }
            }

            //THIS IS IMPORTANT
            //updates the state which will be reflected on the board
            setTimeout(() => {state.set(currentState);}, 100);
        case (Direction.Up):
        case (Direction.Down):
        default:
            return;
    }
}