'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaRedo,
  FaCheck,
  FaLightbulb,
  FaCompass,
  FaArrowRight,
  FaTh
} from 'react-icons/fa';
import puzzleImage from '../assets/images/interiorPage/feature-future-interior.jpg';
import './not-found.css';

// 9 tiles for a 3x3 architectural interior layout
const INITIAL_ROTATIONS = [90, 180, 270, 180, 90, 270, 270, 180, 90];

export default function NotFound() {
  const [rotations, setRotations] = useState(INITIAL_ROTATIONS);
  const [moves, setMoves] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Shuffle tiles with random initial rotations (90, 180, or 270)
    shufflePuzzle();
  }, []);

  const shufflePuzzle = () => {
    const randomChoices = [90, 180, 270];
    const shuffled = Array.from({ length: 9 }, () => {
      const idx = Math.floor(Math.random() * randomChoices.length);
      return randomChoices[idx];
    });
    setRotations(shuffled);
    setMoves(0);
  };

  const handleTileClick = (index) => {
    if (isSolved) return;

    setRotations((prev) => {
      const next = [...prev];
      next[index] = (next[index] + 90) % 360;
      return next;
    });
    setMoves((m) => m + 1);
  };

  const handleSolve = () => {
    setRotations([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const isSolved = isClient && rotations.every((deg) => deg === 0);
  const imgSrc = puzzleImage?.src || puzzleImage;

  return (
    <div className="notfound-container">
      <div className="notfound-ambient-glow" />

      {/* Header Bar */}
      <header className="notfound-header">
        <Link href="/" className="notfound-brand">
          3P <span className="accent">COMMUNICATION</span>
        </Link>
        <Link href="/" className="notfound-home-link">
          <FaHome />
          <span>Home Page</span>
        </Link>
      </header>

      {/* Main Viewport */}
      <main className="notfound-main">
        <span className="notfound-badge">
          <FaCompass /> Error 404 • Blueprint Displaced
        </span>

        <h1 className="notfound-title">This Space Hasn't Been Designed Yet</h1>
        <p className="notfound-description">
          The room or page you are looking for does not exist in our current floorplan. While we draft the new blueprints, tap the architectural tiles below to orient and complete the living space!
        </p>

        {/* Artistic Puzzle Game Card */}
        <div className="notfound-puzzle-card">
          <div className="puzzle-game-status">
            <span className="d-flex align-items-center gap-1">
              <FaTh className="text-warning small" />
              <span>Tap tiles to rotate 90°</span>
            </span>
            <span className="puzzle-stat-pill">
              Moves: {moves}
            </span>
          </div>

          {/* 3x3 Tile Grid */}
          <div className={`puzzle-grid ${isSolved ? 'solved' : ''}`}>
            {rotations.map((deg, idx) => {
              const row = Math.floor(idx / 3);
              const col = idx % 3;
              const posX = col * 50; // 0%, 50%, 100%
              const posY = row * 50; // 0%, 50%, 100%

              return (
                <button
                  key={idx}
                  type="button"
                  className={`puzzle-tile ${deg === 0 ? 'correct' : ''}`}
                  onClick={() => handleTileClick(idx)}
                  aria-label={`Rotate tile ${idx + 1}`}
                  style={{
                    backgroundImage: `url(${imgSrc})`,
                    backgroundPosition: `${posX}% ${posY}%`,
                    transform: `rotate(${deg}deg)`,
                  }}
                >
                  {!isSolved && deg === 0 && (
                    <span className="puzzle-tile-indicator" title="Aligned" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory State Banner */}
          {isSolved && (
            <div className="puzzle-victory-banner">
              🎉 <strong>Space Aligned!</strong> You assembled the architectural layout in {moves} moves.
            </div>
          )}

          {/* Controls */}
          <div className="puzzle-controls">
            <button
              type="button"
              className="puzzle-btn-secondary"
              onClick={shufflePuzzle}
              title="Scramble tiles again"
            >
              <FaRedo className="small" />
              <span>Shuffle</span>
            </button>

            {!isSolved && (
              <button
                type="button"
                className="puzzle-btn-secondary"
                onClick={handleSolve}
                title="Automatically orient tiles"
              >
                <FaLightbulb className="small text-warning" />
                <span>Auto-Align</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Action Links */}
        <div className="notfound-actions">
          <Link href="/" className="notfound-btn-primary">
            <FaHome />
            <span>Return to Homepage</span>
          </Link>
          <Link href="/interior" className="notfound-btn-secondary">
            <span>Explore Portfolio</span>
            <FaArrowRight className="small" />
          </Link>
          <Link href="/contactus" className="notfound-btn-secondary">
            <span>Consult Our Team</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
