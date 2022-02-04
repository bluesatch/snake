const board_border = '#000000';
const board_background = '#ffffff';
const snake_col = 'lightblue';
const snake_border = 'darkblue';

// Make the snake => array of coordinates
let snake = [
    {x: 200, y: 200}, {x: 190, y:200},
    {x: 180, y: 200}, {x: 170, y: 200},
    {x: 160, y: 200}
];

let score = 0;
// true if changing direction 
let changing_direction = false;
// horizontal velocity
let dx = 10;
// vertical velocity 
let dy = 0;

// food 
let food_x;
let food_y;

// Make the canvas
const snakeboard = document.getElementById('snakeboard');
const snakeboard_ctx = snakeboard.getContext('2d');

const init =()=> {

    if (hasGameEnded()) return;

    changing_direction = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawSnake();
        drawFood();
        moveSnake();
        init();
    }, 100)
}

// draw border around canvas 
const clearCanvas =()=> {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokeStyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// function that prints the parts
const drawSnake =()=> {
    snake.forEach(drawSnakePart)
};

// draw the food 
const drawFood =()=> {
    snakeboard_ctx.fillStyle = 'lightgreen';
    snakeboard_ctx.strokeStyle = 'darkgreen';
    snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// function to draw the snake's body 
const drawSnakePart =(snakePart)=> {
    snakeboard_ctx.fillStyle = 'lightblue';
    snakeboard_ctx.strokeStyle = 'darkblue';
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

const hasGameEnded =()=> {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

// Randomize food
const randomFood =(min, max)=> {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

const generateFood =()=> {
    food_x = randomFood(0, snakeboard.width - 10);
    food_y = randomFood(0, snakeboard.height - 10);

    snake.forEach(function hasSnakeEatenFood(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) {
            generateFood();
        }
    })
}

// move snake with key press
const changeDirection =(e)=> {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // prevent snake from reversing

    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = e.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    };

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    };

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    };

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }

}



const moveSnake =()=> {
    // create new head for snake then add new head to beginning of snake and remove the last element 
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;

    if (has_eaten_food) {
        score += 10;

        let displayScore = document.getElementById('score');
        displayScore.innerText = score;

        generateFood();
    } else {
        snake.pop();
    }
}

// start game
init();
document.addEventListener('keydown', changeDirection);

generateFood();




