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


export const state: Box[] = [];

state.push(
    { value: 1, row: 0, col: 0, id: 0 },
    { value: 2, row: 1, col: 1, id: 1 },
    { value: 3, row: 2, col: 2, id: 2 },
    { value: 4, row: 3, col: 3, id: 3 }
);

export function move(box: Box, dir: Direction) {
    const node = document.querySelector<HTMLElement>(`#box-${box.id}`);

    if (!node) {
        return;
    }

    let px;
    switch (dir) {
        case Direction.Up:
            if (box.row > 0) {
                px = parseInt(node.style.top.split('px')[0]) || 0;
                node.style.top = (px - 85) + 'px';
                
                box.row--;
            }
            break;
        case Direction.Down:
            if (box.row < 3) {
                px = parseInt(node.style.top.split('px')[0]) || 0;
                node.style.top = (px + 85) + 'px';

                box.row++;
            }
            break;
        case Direction.Right:
            if (box.col < 3) {
                px = parseInt(node.style.left.split('px')[0]) || 0;
                node.style.left = (px + 85) + 'px';

                box.col++;
            }
            break;
        case Direction.Left:
            if (box.col > 0) {
                px = parseInt(node.style.left.split('px')[0]) || 0;
                node.style.left = (px - 85) + 'px';

                box.col--;
            }
            break;
        default:
            return;
    }

    console.log(node);
}

export function setupEventListeners() {
    document.addEventListener('keypress', (event) => {
        let dir: Direction;
        switch (event.key) {
            case 'a':
                dir = Direction.Left;
                break;
            case 's':
                dir = Direction.Down;
                break;
            case 'd':
                dir = Direction.Right;
                break;
            case 'w':
                dir = Direction.Up;
                break;
            default:
                return;
        }

        for (const box of state) {
            move(box, dir);
        }
    })
}

function checkOccupied(row: number, col: number) {
    for (const b of state) {
        if (col == b.col && row == b.row) {
            return true;
        }
    }
    return false;
}