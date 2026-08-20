// src/App.jsx
import React, { useState } from "react";
import { Container, Box, Typography, Chip, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import BalanceGauge from "./components/BalanceGauge";
import BoatVisualizer from "./components/BoatVisualizer";
import SeatEditorModal from "./components/SeatEditorModal";
import RosterModal from "./components/RosterModal";
import ExportModal from "./components/ExportModal";
import LineupHistoryModal from "./components/LineupHistoryModal";
import MobileStickyBar from "./components/MobileStickyBar";

function MainContent() {
  const { activeBoatConfig, lineupName } = useApp();

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [openRoster, setOpenRoster] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", pb: { xs: 10, sm: 6 } }}>
      {/* Header Principal */}
      <Header
        onOpenRoster={() => setOpenRoster(true)}
        onOpenExport={() => setOpenExport(true)}
        onOpenHistory={() => setOpenHistory(true)}
      />

      {/* Conteúdo Principal Centrado (Layout SaaS Canomama) */}
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>
        {/* Título da Escalação Atual */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--accent-pink)",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              {lineupName}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {activeBoatConfig.name} • {activeBoatConfig.description}
            </Typography>
          </Box>

          <Chip
            icon={<span style={{ fontSize: "1.1rem" }}>{activeBoatConfig.icon}</span>}
            label={`${activeBoatConfig.paddlerCount} Assentos`}
            size="small"
            sx={{
              bgcolor: "var(--accent-pink-soft)",
              color: "var(--accent-pink)",
              fontWeight: 800,
              border: "1px solid var(--border-glass)",
            }}
          />
        </Box>

        {/* Medidor de Nível e Carga */}
        <BalanceGauge />

        {/* Visualizador Gráfico Interativo do Barco */}
        <BoatVisualizer onSelectSeat={(seatData) => setSelectedSeat(seatData)} />
      </Container>

      {/* Modais do Sistema */}
      {selectedSeat && (
        <SeatEditorModal seatInfo={selectedSeat} onClose={() => setSelectedSeat(null)} />
      )}

      <RosterModal open={openRoster} onClose={() => setOpenRoster(false)} />
      <ExportModal open={openExport} onClose={() => setOpenExport(false)} />
      <LineupHistoryModal open={openHistory} onClose={() => setOpenHistory(false)} />

      {/* Barra Flutuante Mobile */}
      <MobileStickyBar onOpenExport={() => setOpenExport(true)} />
    </Box>
  );
}

// MUI Theme fixo no estilo Associação Canomama (Branco & Rosa)
const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#c2185b" },
    secondary: { main: "#e91e63" },
    background: { default: "#fbf6f8", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "var(--font-body)",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
