import '../scss/styles.scss';
import { PongGame } from './pong/pong';


const customCanvas = document.getElementById('customCanvas');
const pongGame = new PongGame(customCanvas, customCanvas.width, customCanvas.height);