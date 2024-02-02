// pong.js
export class PongGame {
    constructor(canvasElement, canvasWidth, canvasHeight) {
        this.canvas = canvasElement;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // Load images
        this.backgroundImage = new Image();
        this.backgroundImage.src = '/assets/pong/bg.jpeg';

        this.paddleImage = new Image();
        this.paddleImage.src = '/assets/pong/paddle.png';

        this.ballImage = new Image();
        this.ballImage.src = '/assets/pong/ball.png';

        this.player1Icon = new Image();
        this.player1Icon.src = '/assets/pong/player1.png';

        this.player2Icon = new Image();
        this.player2Icon.src = '/assets/pong/player2.png';

        // Initialize scores
        this.player1Score = 0;
        this.player2Score = 0;

        // Paddle
        this.paddleWidth = 10;
        this.paddleHeight = 60;
        this.paddle1Y = (canvasHeight - this.paddleHeight) / 2;
        this.paddle2Y = (canvasHeight - this.paddleHeight) / 2;

        // Ball
        this.ballSize = 10;
        this.ballX = canvasWidth / 2;
        this.ballY = canvasHeight / 2;
        this.ballSpeedX = 5;
        this.ballSpeedY = 5;

        // Keyboard input
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
        };

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Start the game loop
        this.draw();
    }

    handleKeyDown(event) {
        this.keys[event.key] = true;
    }

    handleKeyUp(event) {
        this.keys[event.key] = false;
    }

    updatePaddles() {
        // Move paddle 1
        if (this.keys['ArrowUp'] && this.paddle1Y > 0) {
            this.paddle1Y -= 5;
        }

        if (this.keys['ArrowDown'] && this.paddle1Y + this.paddleHeight < this.canvas.height) {
            this.paddle1Y += 5;
        }

        // Move paddle 2
        if (this.paddle2Y <= 0 && this.ballY < this.paddle2Y + this.paddleHeight / 2) {
            // Move up
            this.paddle2Y -= 5;
        } else if (this.paddle2Y + this.paddleHeight >= this.canvas.height && this.ballY > this.paddle2Y + this.paddleHeight / 2) {
            // Move down
            this.paddle2Y += 5;
        } else if (this.ballY < this.paddle2Y + this.paddleHeight / 2) {
            // Move up
            this.paddle2Y -= 5;
        } else {
            // Move down
            this.paddle2Y += 5;
        }
    }

    updateBall() {
        // Update ball position
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        // Ball collision with walls
        if (this.ballY - this.ballSize < 0 || this.ballY + this.ballSize > this.canvas.height) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        // Ball collision with paddles
        if (
            (this.ballX - this.ballSize < this.paddleWidth && this.ballY > this.paddle1Y && this.ballY < this.paddle1Y + this.paddleHeight) ||
            (this.ballX + this.ballSize > this.canvas.width - this.paddleWidth && this.ballY > this.paddle2Y && this.ballY < this.paddle2Y + this.paddleHeight)
        ) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Check if the ball goes out of bounds
        if (this.ballX - this.ballSize < 0) {
            // Player 2 scores
            this.player2Score++;
            this.resetBall();
        } else if (this.ballX + this.ballSize > this.canvas.width) {
            // Player 1 scores
            this.player1Score++;
            this.resetBall();
        }
    }

    resetBall() {
        // Reset ball position
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // Update paddles and ball
        this.updatePaddles();
        this.updateBall();

        // Draw center line
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.canvas.width / 2 - 1, 0, 2, this.canvas.height);

        // Draw paddles
        this.ctx.drawImage(this.paddleImage, 0, this.paddle1Y, this.paddleWidth, this.paddleHeight);
        this.ctx.drawImage(this.paddleImage, this.canvas.width - this.paddleWidth, this.paddle2Y, this.paddleWidth, this.paddleHeight);

        // Draw ball
        this.ctx.drawImage(this.ballImage, this.ballX - this.ballSize, this.ballY - this.ballSize, 2 * this.ballSize, 2 * this.ballSize);

        // Display scores using player icons
        this.renderPlayerIcon(this.player1Icon, 50, 30, this.player1Score);
        this.renderPlayerIcon(this.player2Icon, this.canvas.width - 150, 30, this.player2Score);

        // Request next animation frame
        requestAnimationFrame(() => this.draw());
    }

    renderPlayerIcon(icon, x, y, score) {
        this.ctx.drawImage(icon, x, y, 30, 30); // Adjust the size of the icons as needed
        this.ctx.font = '16px Arial'; // Change the font for the scores
        this.ctx.fillStyle = '#fff'; // Change the color for the scores
        this.ctx.fillText(`: ${score}`, x + 35, y + 20);
    }
}
