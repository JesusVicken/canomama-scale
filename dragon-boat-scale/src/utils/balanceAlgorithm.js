// src/utils/balanceAlgorithm.js

export const parseWeight = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const normalized = String(val).replace(",", ".").trim();
  const num = parseFloat(normalized);
  return isNaN(num) || num < 0 ? 0 : num;
};

export const formatNumber = (num, decimals = 1) => {
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const calculateBoatMetrics = (lineup, boatConfig) => {
  if (boatConfig.isSingleColumn) {
    // OC6 Calculation
    const seats = lineup.singleColumn || [];
    const totalPaddlerWeight = seats.reduce((acc, s) => acc + parseWeight(s.weight), 0);
    
    // Em OC6, remadores em posições 1, 3, 5 remam para um lado (ex: Esquerda) e 2, 4, 6 para o outro (Direita)
    const leftWeight = seats
      .filter((_, idx) => idx % 2 === 0)
      .reduce((acc, s) => acc + parseWeight(s.weight), 0);
    const rightWeight = seats
      .filter((_, idx) => idx % 2 === 1)
      .reduce((acc, s) => acc + parseWeight(s.weight), 0);

    const bowWeight = seats.slice(0, 3).reduce((acc, s) => acc + parseWeight(s.weight), 0);
    const sternWeight = seats.slice(3, 6).reduce((acc, s) => acc + parseWeight(s.weight), 0);

    const grandTotal = totalPaddlerWeight;
    const totalWithBoat = grandTotal + boatConfig.emptyBoatWeight;
    const diffLateral = leftWeight - rightWeight;
    const diffLongitudinal = bowWeight - sternWeight;

    return {
      totalLeft: leftWeight,
      totalRight: rightWeight,
      paddlerTotal: grandTotal,
      grandTotal,
      totalWithBoat,
      diffLateral,
      diffLongitudinal,
      bowWeight,
      sternWeight,
      isExceeded: totalWithBoat > boatConfig.maxCapacity,
      safetyPercent: Math.min(100, Math.round((totalWithBoat / boatConfig.maxCapacity) * 100)),
    };
  }

  // Dragon Boat (DB10 / DB20) Calculation
  const leftArr = lineup.leftSide || [];
  const rightArr = lineup.rightSide || [];
  const drummerWeight = parseWeight(lineup.drummer?.weight);
  const steersWeight = parseWeight(lineup.steersperson?.weight);

  const leftWeight = leftArr.reduce((acc, r) => acc + parseWeight(r.weight), 0);
  const rightWeight = rightArr.reduce((acc, r) => acc + parseWeight(r.weight), 0);

  const totalPaddlers = leftWeight + rightWeight;
  const grandTotal = totalPaddlers + drummerWeight + steersWeight;
  const totalWithBoat = grandTotal + boatConfig.emptyBoatWeight;

  const diffLateral = leftWeight - rightWeight;

  // Longitudinal (Proa / Popa): Metade da frente vs Metade de trás
  const halfRows = Math.floor(leftArr.length / 2);
  const bowLeft = leftArr.slice(0, halfRows).reduce((acc, r) => acc + parseWeight(r.weight), 0);
  const bowRight = rightArr.slice(0, halfRows).reduce((acc, r) => acc + parseWeight(r.weight), 0);
  const sternLeft = leftArr.slice(halfRows).reduce((acc, r) => acc + parseWeight(r.weight), 0);
  const sternRight = rightArr.slice(halfRows).reduce((acc, r) => acc + parseWeight(r.weight), 0);

  const bowWeight = bowLeft + bowRight + drummerWeight;
  const sternWeight = sternLeft + sternRight + steersWeight;
  const diffLongitudinal = bowWeight - sternWeight;

  return {
    totalLeft: leftWeight,
    totalRight: rightWeight,
    drummerWeight,
    steersWeight,
    paddlerTotal: totalPaddlers,
    grandTotal,
    totalWithBoat,
    diffLateral,
    diffLongitudinal,
    bowWeight,
    sternWeight,
    isExceeded: totalWithBoat > boatConfig.maxCapacity,
    safetyPercent: Math.min(100, Math.round((totalWithBoat / boatConfig.maxCapacity) * 100)),
  };
};

// Algoritmo de Sugestão de Troca e Movimento Inteligente
export const findBestBalanceAction = (lineup, boatConfig) => {
  if (boatConfig.isSingleColumn) return null; // Não se aplica a OC6

  const leftSide = lineup.leftSide || [];
  const rightSide = lineup.rightSide || [];

  const leftTotal = leftSide.reduce((acc, r) => acc + parseWeight(r.weight), 0);
  const rightTotal = rightSide.reduce((acc, r) => acc + parseWeight(r.weight), 0);
  const currentDiff = leftTotal - rightTotal;

  if (Math.abs(currentDiff) < 1.0) {
    return null; // Barco já está perfeitamente equilibrado!
  }

  let bestSwap = {
    postDiff: Math.abs(currentDiff),
    leftIndex: -1,
    rightIndex: -1,
    leftPerson: null,
    rightPerson: null,
  };

  // 1. Procurar a melhor troca de remadores (Swap)
  for (let i = 0; i < leftSide.length; i++) {
    const wl = parseWeight(leftSide[i].weight);
    if (wl === 0) continue;

    for (let j = 0; j < rightSide.length; j++) {
      const wr = parseWeight(rightSide[j].weight);
      if (wr === 0) continue;

      // Nova diferença se trocarmos leftSide[i] com rightSide[j]
      const newDiff = Math.abs(currentDiff - 2 * (wl - wr));
      if (newDiff < bestSwap.postDiff) {
        bestSwap = {
          postDiff: newDiff,
          leftIndex: i,
          rightIndex: j,
          leftPerson: leftSide[i],
          rightPerson: rightSide[j],
        };
      }
    }
  }

  // 2. Procurar a melhor mudança simples de um lado para o outro (Move)
  let bestMove = {
    postDiff: Math.abs(currentDiff),
    side: null,
    index: -1,
    person: null,
  };
  const heavierSideName = currentDiff > 0 ? "left" : "right";
  const heavierArr = currentDiff > 0 ? leftSide : rightSide;

  for (let i = 0; i < heavierArr.length; i++) {
    const w = parseWeight(heavierArr[i].weight);
    if (w === 0) continue;

    const newDiff = Math.abs(Math.abs(currentDiff) - 2 * w);
    if (newDiff < bestMove.postDiff) {
      bestMove = {
        postDiff: newDiff,
        side: heavierSideName,
        index: i,
        person: heavierArr[i],
      };
    }
  }

  // Retorna a melhor opção entre Swap e Move
  if (bestSwap.leftIndex !== -1 && bestSwap.postDiff <= bestMove.postDiff) {
    return {
      type: "swap",
      ...bestSwap,
      improvement: Math.abs(currentDiff) - bestSwap.postDiff,
    };
  }

  if (bestMove.index !== -1) {
    return {
      type: "move",
      ...bestMove,
      improvement: Math.abs(currentDiff) - bestMove.postDiff,
    };
  }

  return null;
};

// Aplica a sugestão no estado do lineup e retorna o novo lineup
export const applyBalanceSuggestion = (lineup, suggestion) => {
  if (!suggestion) return lineup;

  const newLeft = [...lineup.leftSide];
  const newRight = [...lineup.rightSide];

  if (suggestion.type === "swap") {
    const temp = newLeft[suggestion.leftIndex];
    newLeft[suggestion.leftIndex] = newRight[suggestion.rightIndex];
    newRight[suggestion.rightIndex] = temp;

    return {
      ...lineup,
      leftSide: newLeft,
      rightSide: newRight,
    };
  }

  if (suggestion.type === "move") {
    const fromLeft = suggestion.side === "left";
    const sourceArr = fromLeft ? newLeft : newRight;
    const targetArr = fromLeft ? newRight : newLeft;

    const movingPerson = { ...sourceArr[suggestion.index] };
    sourceArr[suggestion.index] = { ...sourceArr[suggestion.index], name: "", weight: "" };

    // Encontra primeiro assento vazio no lado destino
    const emptyTargetIndex = targetArr.findIndex(
      (r) => !r.name && (!r.weight || parseWeight(r.weight) === 0)
    );

    if (emptyTargetIndex !== -1) {
      targetArr[emptyTargetIndex] = {
        ...targetArr[emptyTargetIndex],
        name: movingPerson.name,
        weight: movingPerson.weight,
      };
    } else {
      // Se não houver vaga vazia, faz o swap com o assento de mesmo número da fileira
      const tempTarget = targetArr[suggestion.index];
      targetArr[suggestion.index] = {
        ...targetArr[suggestion.index],
        name: movingPerson.name,
        weight: movingPerson.weight,
      };
      sourceArr[suggestion.index] = {
        ...sourceArr[suggestion.index],
        name: tempTarget.name,
        weight: tempTarget.weight,
      };
    }

    return {
      ...lineup,
      leftSide: newLeft,
      rightSide: newRight,
    };
  }

  return lineup;
};
