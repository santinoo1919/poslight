/// <reference types="nativewind/types" />

// Global type declarations for web APIs used in React Native
declare global {
  const performance: {
    now(): number;
  };

  function alert(message: string): void;
}
