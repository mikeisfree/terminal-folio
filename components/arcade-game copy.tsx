"use client";

import { useState, useEffect, useRef } from "react";
import "@/styles/arcade-game.css";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const COLORS = {
  player: "#00ff00", // Same as --main-text
  enemy: "#ff0000",  // Same as --neon-red
  bullet: "#00ff00",
  text: "#00ff00",
  background: "#000000"
};

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Bullet extends GameObject {
  active: boolean;
}

interface Enemy extends GameObject {
  active: boolean;
}

type GameState = {
  player: GameObject;
  bullets: Bullet[];
  enemies: Enemy[];
  keys: {[key: string]: boolean};
  initialized: boolean;
};

export function ArcadeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const canvasSizeRef = useRef({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    dpr: 1
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Game objects
  const gameStateRef = useRef<GameState>({
    player: {
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      speed: 5
    },
    bullets: [],
    enemies: [],
    keys: {},
    initialized: false
  });

  // Initialize canvas immediately after mounting
  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas element not found");
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      console.log("Setting initial canvas size");
      // Set canvas size and scale for HiDPI displays
      canvasSizeRef.current.dpr = window.devicePixelRatio || 1;
      canvas.width = CANVAS_WIDTH * canvasSizeRef.current.dpr;
      canvas.height = CANVAS_HEIGHT * canvasSizeRef.current.dpr;
      canvas.style.width = `${CANVAS_WIDTH}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;

      // Scale all future drawing operations
      ctx.scale(canvasSizeRef.current.dpr, canvasSizeRef.current.dpr);
      ctx.imageSmoothingEnabled = false;

      console.log(`Canvas dimensions set: ${canvas.width}x${canvas.height}`);

      console.log("Drawing initial loading screen");
      // Draw loading screen
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = COLORS.text;
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Loading...', canvas.width/2, canvas.height/2);

      // Test drawing something
      ctx.fillStyle = COLORS.player;
      ctx.fillRect(375, 550, 50, 30);

    } catch (err) {
      console.error('Canvas initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    }
  }, []);

  const initGame = () => {
    try {
      console.log("Initializing game...");
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas not found");
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Initialize player position
      const state = gameStateRef.current;
      // Use logical dimensions for game objects
      state.player.x = CANVAS_WIDTH / 2 - state.player.width / 2;
      state.player.y = CANVAS_HEIGHT - state.player.height - 10;
      state.bullets = [];
      state.enemies = [];
      state.initialized = true;

      console.log("Game initialized successfully");
      setScore(0);
      setGameOver(false);
      setIsPaused(false);

      // Force initial render
      drawGame(ctx);
    } catch (err) {
      console.error('Game initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    }
  };

  useEffect(() => {
    console.log("Component mounted");
    const timer = setTimeout(() => {
      setIsLoading(false);
      initGame();
    }, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = true;
      if (e.key === ' ') {
        e.preventDefault();
        shoot();
      }
      if (e.key === 'p') {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(timer);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading || !gameStateRef.current.initialized) {
      console.log("Game not ready for animation frame", { isLoading, initialized: gameStateRef.current.initialized });
      return;
    }

    // Check for requestAnimationFrame support
    if (!window.requestAnimationFrame) {
      setError("Your browser doesn't support requestAnimationFrame");
      return;
    }

    console.log("Starting game loop...");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      console.error("Canvas or context not available for game loop");
      return;
    }

    console.log("Setting up game loop with canvas:", {
      width: canvas.width,
      height: canvas.height,
      style: canvas.style.cssText
    });

    const gameLoop = (timestamp: number) => {
      if (!previousTimeRef.current) {
        previousTimeRef.current = timestamp;
      }
      const deltaTime = timestamp - previousTimeRef.current;
      previousTimeRef.current = timestamp;

      try {
        if (!isPaused && !gameOver) {
          updateGame(deltaTime);
        }
        drawGame(ctx);
        requestRef.current = requestAnimationFrame(gameLoop);
      } catch (err) {
        console.error('Game loop error:', err);
        setError(err instanceof Error ? err.message : 'Game error occurred');
      }
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPaused, gameOver, isLoading]);

  const updateGame = (deltaTime: number) => {
    const state = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update player
    if (state.keys['ArrowLeft']) {
      state.player.x -= state.player.speed * (deltaTime / 16); // Normalize to ~60fps
    }
    if (state.keys['ArrowRight']) {
      state.player.x += state.player.speed * (deltaTime / 16);
    }

    // Keep player in bounds
    state.player.x = Math.max(0, Math.min(CANVAS_WIDTH - state.player.width, state.player.x));

    // Update bullets
    state.bullets = state.bullets.filter(bullet => {
      bullet.y -= bullet.speed * (deltaTime / 16);
      return bullet.y > -bullet.height && bullet.active;
    });

    // Update enemies
    state.enemies = state.enemies.filter(enemy => {
      enemy.y += enemy.speed * (deltaTime / 16);
      return enemy.y < canvas.height && enemy.active;
    });

    // Spawn enemies
    if (Math.random() < 0.02 && state.enemies.length < 10) {
      state.enemies.push({
        x: Math.random() * (CANVAS_WIDTH - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: 2,
        active: true
      });
    }

    // Check collisions
    checkCollisions();
  };

  const shoot = () => {
    if (gameOver || isPaused) return;
    const state = gameStateRef.current;
    
    state.bullets.push({
      x: state.player.x + state.player.width/2 - 2,
      y: state.player.y,
      width: 4,
      height: 10,
      speed: 7,
      active: true
    });
  };

  const checkCollisions = () => {
    const state = gameStateRef.current;

    // Check bullet-enemy collisions
    state.bullets.forEach(bullet => {
      state.enemies.forEach(enemy => {
        if (bullet.active && enemy.active &&
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y) {
          bullet.active = false;
          enemy.active = false;
          setScore(prev => prev + 100);
        }
      });
    });

    // Check player-enemy collisions
    state.enemies.forEach(enemy => {
      if (enemy.active &&
          state.player.x < enemy.x + enemy.width &&
          state.player.x + state.player.width > enemy.x &&
          state.player.y < enemy.y + enemy.height &&
          state.player.y + state.player.height > enemy.y) {
        setGameOver(true);
      }
    });
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const state = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

      // Clear the canvas
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!gameOver && !isPaused) {
      // Draw player
      ctx.fillStyle = COLORS.player;
      ctx.beginPath();
      ctx.moveTo(state.player.x + state.player.width/2, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + state.player.height);
      ctx.lineTo(state.player.x + state.player.width, state.player.y + state.player.height);
      ctx.closePath();
      ctx.fill();

      // Draw bullets
      ctx.fillStyle = COLORS.bullet;
      state.bullets.forEach(bullet => {
        if (bullet.active) {
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
      });

      // Draw enemies
      state.enemies.forEach(enemy => {
        if (enemy.active) {
          ctx.fillStyle = COLORS.enemy;
          ctx.beginPath();
          ctx.moveTo(enemy.x + enemy.width/2, enemy.y + enemy.height);
          ctx.lineTo(enemy.x, enemy.y);
          ctx.lineTo(enemy.x + enemy.width, enemy.y);
          ctx.closePath();
          ctx.fill();
        }
      });
    }

    // Draw score
    ctx.fillStyle = COLORS.text;
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Draw game over or pause screen
    if (gameOver || isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = gameOver ? COLORS.enemy : COLORS.text;
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        gameOver ? 'GAME OVER' : 'PAUSED',
        canvas.width/2,
        canvas.height/2
      );

      if (gameOver) {
        ctx.font = '20px Arial';
        ctx.fillText(
          `Final Score: ${score}`,
          canvas.width/2,
          canvas.height/2 + 40
        );
      }
    }
  };

  if (error) {
    return (
      <div className="arcade-container">
        <div className="text-red-500 text-xl">Error: {error}</div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Reload Game
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="arcade-container">
        <div className="arcade-text text-2xl mb-4">Loading Arcade Game</div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00ff00] transition-all duration-100"
            style={{ width: '100%', animation: 'loading 1.5s linear' }}
          />
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="arcade-container">
      <div className="mb-4 arcade-text">
        Use Arrow keys to move, Space to shoot, P to pause
      </div>
      <canvas 
        ref={canvasRef}
        className="arcade-canvas pixelated"
      style={{
          maxWidth: '100%',
          height: 'auto',
          imageRendering: 'pixelated',
          WebkitFontSmoothing: 'none',
          backgroundColor: COLORS.background
        }}
      />
      {gameOver && (
        <button
          className="mt-4 px-4 py-2 bg-[#00ff00] text-black rounded hover:bg-opacity-80"
          onClick={() => initGame()}
        >
          Play Again
        </button>
      )}
    </div>
  );
}
