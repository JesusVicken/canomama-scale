// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { BOAT_TYPES, DEFAULT_BOAT_ID, createInitialLineup } from "../utils/boatConfigs";
import { calculateBoatMetrics, findBestBalanceAction, applyBalanceSuggestion } from "../utils/balanceAlgorithm";

const AppContext = createContext();

const STORAGE_KEYS = {
  BOAT_ID: "canomama_active_boat",
  LINEUP_PREFIX: "canomama_lineup_",
  ROSTER: "canomama_roster_v3",
  SAVED_LINEUPS: "canomama_saved_lineups_v3",
  AUTH: "canomama_auth_v1",
};

export const AUTH_CREDENTIALS = {
  username: "canomama",
  password: "canomama",
};

export const AppProvider = ({ children }) => {
  // Autenticação (Login / Logout)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
    } catch {
      return false;
    }
  });

  const login = (user, pass) => {
    const cleanUser = String(user || "").trim().toLowerCase();
    const cleanPass = String(pass || "").trim();

    if (cleanUser === AUTH_CREDENTIALS.username && cleanPass === AUTH_CREDENTIALS.password) {
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: "Usuário ou senha incorretos. Tente novamente!",
    };
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  // Active Boat Type
  const [activeBoatId, setActiveBoatId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.BOAT_ID) || DEFAULT_BOAT_ID;
    } catch (e) {
      return DEFAULT_BOAT_ID;
    }
  });

  const activeBoatConfig = useMemo(() => BOAT_TYPES[activeBoatId] || BOAT_TYPES[DEFAULT_BOAT_ID], [activeBoatId]);

  // Lineup Active
  const [lineup, setLineup] = useState(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.LINEUP_PREFIX}${activeBoatId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return createInitialLineup(activeBoatId);
  });

  const [lineupName, setLineupName] = useState("Escalação Principal");

  // Carrega ou salva a escalação no localStorage conforme o barco muda
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.LINEUP_PREFIX}${activeBoatId}`);
      if (raw) {
        setLineup(JSON.parse(raw));
      } else {
        setLineup(createInitialLineup(activeBoatId));
      }
      localStorage.setItem(STORAGE_KEYS.BOAT_ID, activeBoatId);
    } catch (e) {
      setLineup(createInitialLineup(activeBoatId));
    }
  }, [activeBoatId]);

  // Persiste a escalação atual no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.LINEUP_PREFIX}${activeBoatId}`, JSON.stringify(lineup));
    } catch (e) {}
  }, [lineup, activeBoatId]);

  // Roster / Atletas Salvos no Cadastro (Sem dados fictícios/mock)
  const [roster, setRoster] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ROSTER);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(roster));
    } catch (e) {}
  }, [roster]);

  // Escalações Passadas Salvas
  const [savedLineups, setSavedLineups] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_LINEUPS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_LINEUPS, JSON.stringify(savedLineups));
    } catch (e) {}
  }, [savedLineups]);

  // Métricas do barco ativo
  const metrics = useMemo(() => calculateBoatMetrics(lineup, activeBoatConfig), [lineup, activeBoatConfig]);

  // Sugestão de Equilíbrio Ativa
  const balanceSuggestion = useMemo(() => findBestBalanceAction(lineup, activeBoatConfig), [lineup, activeBoatConfig]);

  // Funções de atualização da escalação
  const updateSeat = (side, index, field, value) => {
    setLineup((prev) => {
      const arrName = side === "left" ? "leftSide" : "rightSide";
      const newArr = [...(prev[arrName] || [])];
      newArr[index] = { ...newArr[index], [field]: value };
      return { ...prev, [arrName]: newArr };
    });
  };

  const updateSpecialSeat = (role, field, value) => {
    setLineup((prev) => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }));
  };

  const assignAthleteToSeat = (side, index, athlete) => {
    if (!athlete) return;
    if (side === "drummer" || side === "steersperson") {
      updateSpecialSeat(side, "name", athlete.name);
      updateSpecialSeat(side, "weight", athlete.weight);
      return;
    }
    updateSeat(side, index, "name", athlete.name);
    updateSeat(side, index, "weight", athlete.weight);
  };

  const saveAthleteToRoster = (name, weight, sidePreference = "both") => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    const cleanWeight = String(weight || "").replace(",", ".").trim();

    setRoster((prev) => {
      const existingIdx = prev.findIndex((a) => a.name.toLowerCase() === cleanName.toLowerCase());
      if (existingIdx !== -1) {
        // Atualiza peso e preferência se já existe
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          weight: cleanWeight || updated[existingIdx].weight,
          sidePreference,
        };
        return updated;
      }
      // Adiciona novo atleta
      return [
        {
          id: `ath-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: cleanName,
          weight: cleanWeight,
          sidePreference,
        },
        ...prev,
      ];
    });
  };

  const clearSeat = (side, index) => {
    if (side === "drummer" || side === "steersperson") {
      updateSpecialSeat(side, "name", "");
      updateSpecialSeat(side, "weight", "");
      return;
    }
    updateSeat(side, index, "name", "");
    updateSeat(side, index, "weight", "");
  };

  const applyBalance = () => {
    if (!balanceSuggestion) return;
    setLineup((prev) => applyBalanceSuggestion(prev, balanceSuggestion));
  };

  const resetLineup = () => {
    setLineup(createInitialLineup(activeBoatId));
  };

  // Roster CRUD
  const addAthleteToRoster = (athleteData) => {
    saveAthleteToRoster(athleteData.name, athleteData.weight, athleteData.sidePreference);
  };

  const deleteAthleteFromRoster = (id) => {
    setRoster((prev) => prev.filter((a) => a.id !== id));
  };

  // Salvar e Carregar Escalações Passadas
  const saveCurrentLineup = (name) => {
    const title = name && name.trim() ? name.trim() : `Treino ${new Date().toLocaleDateString("pt-BR")}`;
    const newSave = {
      id: `lineup-${Date.now()}`,
      name: title,
      boatId: activeBoatId,
      createdAt: new Date().toISOString(),
      lineupData: JSON.parse(JSON.stringify(lineup)),
    };
    setSavedLineups((prev) => [newSave, ...prev]);
    setLineupName(title);
  };

  const loadSavedLineup = (savedItem) => {
    if (savedItem.boatId !== activeBoatId) {
      setActiveBoatId(savedItem.boatId);
    }
    setLineup(JSON.parse(JSON.stringify(savedItem.lineupData)));
    setLineupName(savedItem.name);
  };

  const deleteSavedLineup = (id) => {
    setSavedLineups((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        activeBoatId,
        setActiveBoatId,
        activeBoatConfig,
        lineup,
        lineupName,
        setLineupName,
        metrics,
        balanceSuggestion,
        updateSeat,
        updateSpecialSeat,
        assignAthleteToSeat,
        saveAthleteToRoster,
        clearSeat,
        applyBalance,
        resetLineup,
        roster,
        addAthleteToRoster,
        deleteAthleteFromRoster,
        savedLineups,
        saveCurrentLineup,
        loadSavedLineup,
        deleteSavedLineup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de um AppProvider");
  }
  return context;
};
