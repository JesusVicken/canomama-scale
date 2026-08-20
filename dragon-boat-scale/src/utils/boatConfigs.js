// src/utils/boatConfigs.js

export const BOAT_TYPES = {
  DB20: {
    id: "DB20",
    name: "Dragon Boat 20",
    shortName: "Dragon 20",
    paddlerCount: 20,
    rows: 10,
    hasDrummer: true,
    hasSteersperson: true,
    emptyBoatWeight: 250, // kg
    maxCapacity: 2200, // kg
    icon: "🐉",
    description: "Barco Dragon Boat oficial para 20 remadores (10 pares) + Tamborilheiro e Leme."
  },
  DB10: {
    id: "DB10",
    name: "Dragon Boat 10",
    shortName: "Dragon 10",
    paddlerCount: 10,
    rows: 5,
    hasDrummer: true,
    hasSteersperson: true,
    emptyBoatWeight: 175, // kg
    maxCapacity: 1200, // kg
    icon: "⛵",
    description: "Barco Dragon Boat para 10 remadores (5 pares) + Tamborilheiro e Leme."
  }
};

export const DEFAULT_BOAT_ID = "DB20";

// Cria assentos vazios iniciais para um tipo de barco
export const createInitialLineup = (boatTypeId) => {
  const config = BOAT_TYPES[boatTypeId] || BOAT_TYPES.DB20;

  // Lado esquerdo e direito por fileira
  const leftSide = Array.from({ length: config.rows }, (_, i) => ({
    id: `seat-left-${i + 1}`,
    rowNumber: i + 1,
    side: "left",
    name: "",
    weight: "",
  }));

  const rightSide = Array.from({ length: config.rows }, (_, i) => ({
    id: `seat-right-${i + 1}`,
    rowNumber: i + 1,
    side: "right",
    name: "",
    weight: "",
  }));

  return {
    leftSide,
    rightSide,
    drummer: { name: "", weight: "" },
    steersperson: { name: "", weight: "" },
  };
};
