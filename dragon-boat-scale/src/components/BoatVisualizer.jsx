// src/components/BoatVisualizer.jsx
import React from "react";
import { Box, Typography, Grid, IconButton, Chip, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "../context/AppContext";
import { parseWeight, formatNumber } from "../utils/balanceAlgorithm";

export default function BoatVisualizer({ onSelectSeat }) {
  const { lineup, activeBoatConfig, clearSeat } = useApp();

  // Componente de Assento Individual
  const SeatCard = ({ side, index, label, data, isSpecial }) => {
    const hasName = Boolean(data?.name && data.name.trim() !== "");
    const weightNum = parseWeight(data?.weight);

    return (
      <Box
        onClick={() => onSelectSeat({ side, index, data, label })}
        sx={{
          p: 1.2,
          borderRadius: "14px",
          background: hasName ? "#ffffff" : "#fdf2f8",
          border: `1.5px solid ${hasName ? "var(--accent-pink)" : "rgba(194, 24, 91, 0.18)"}`,
          boxShadow: hasName ? "0 4px 14px rgba(194, 24, 91, 0.12)" : "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "var(--accent-pink)",
            bgcolor: "#fce7f3",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          {/* Label do Assento */}
          <Chip
            label={label}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.68rem",
              fontWeight: 800,
              bgcolor: isSpecial ? "rgba(194, 24, 91, 0.15)" : "rgba(194, 24, 91, 0.1)",
              color: "var(--accent-pink)",
              border: "1px solid rgba(194, 24, 91, 0.25)",
            }}
          />

          {hasName && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                clearSeat(side, index);
              }}
              sx={{ p: 0.2, color: "var(--text-muted)", "&:hover": { color: "var(--accent-rose)" } }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>

        {/* Conteúdo do Atleta */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.85rem",
              fontWeight: 800,
              bgcolor: hasName ? "var(--accent-pink)" : "#fbcfe8",
              color: hasName ? "#ffffff" : "var(--accent-pink)",
            }}
          >
            {hasName ? data.name.charAt(0).toUpperCase() : <PersonAddIcon sx={{ fontSize: 16 }} />}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontWeight: hasName ? 800 : 600,
                color: hasName ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: { xs: "0.82rem", sm: "0.88rem" },
              }}
            >
              {hasName ? data.name : "Escalar Participante"}
            </Typography>

            <Typography variant="caption" sx={{ color: hasName ? "var(--accent-pink)" : "var(--text-muted)", fontWeight: 700 }}>
              {hasName ? `${weightNum} kg` : "Toque para preencher"}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%", position: "relative", my: 2 }}>
      {/* Desenho do Casco do Barco (Hull Container) */}
      <Box
        sx={{
          position: "relative",
          p: { xs: 2, sm: 3 },
          borderRadius: "32px",
          background: "linear-gradient(180deg, #ffffff 0%, #fdf2f8 100%)",
          border: "2px solid var(--border-glass)",
          overflow: "hidden",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        {/* Linha Central Decorativa do Barco */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            background: "linear-gradient(180deg, transparent 0%, rgba(194, 24, 91, 0.25) 20%, rgba(194, 24, 91, 0.25) 80%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* PROA (FRENTE DO BARCO) */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "var(--accent-pink-soft)", px: 2, py: 0.5, borderRadius: 10, border: "1px solid var(--border-glass)" }}>
            <Typography variant="caption" sx={{ color: "var(--accent-pink)", fontWeight: 800, letterSpacing: 1.5 }}>
              ▲ PROA (FRENTE)
            </Typography>
          </Box>

          {/* Assento Especial: Tamborilheiro */}
          {activeBoatConfig.hasDrummer && (
            <Box sx={{ maxWidth: 220, mx: "auto", mt: 1.5 }}>
              <SeatCard side="drummer" index={0} label="🥁 Tamborilheiro" data={lineup.drummer} isSpecial />
            </Box>
          )}
        </Box>

        {/* CORPO DO BARCO (ASSENTOS DE REMO: DRAGON BOAT) */}
        <Grid container spacing={{ xs: 1.5, sm: 2.5 }} justifyContent="center">
          {/* Lado Esquerdo */}
          <Grid xs={6} sm={5} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, px: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "var(--accent-pink)", fontSize: "0.8rem" }}>
                👈 ESQUERDA
              </Typography>
              <Chip label={`${formatNumber((lineup.leftSide || []).reduce((a, b) => a + parseWeight(b.weight), 0))} kg`} size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: "var(--accent-pink-soft)", color: "var(--accent-pink)", fontWeight: 800 }} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {(lineup.leftSide || []).map((row, idx) => (
                <SeatCard
                  key={row.id}
                  side="left"
                  index={idx}
                  label={`F${idx + 1} • Esq`}
                  data={row}
                />
              ))}
            </Box>
          </Grid>

          {/* Lado Direito */}
          <Grid xs={6} sm={5} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, px: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "var(--accent-pink)", fontSize: "0.8rem" }}>
                DIREITA 👉
              </Typography>
              <Chip label={`${formatNumber((lineup.rightSide || []).reduce((a, b) => a + parseWeight(b.weight), 0))} kg`} size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: "var(--accent-pink-soft)", color: "var(--accent-pink)", fontWeight: 800 }} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {(lineup.rightSide || []).map((row, idx) => (
                <SeatCard
                  key={row.id}
                  side="right"
                  index={idx}
                  label={`F${idx + 1} • Dir`}
                  data={row}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* POPA (TRÁS DO BARCO) */}
        <Box sx={{ textAlign: "center", mt: 2.5 }}>
          {/* Assento Especial: Leme */}
          {activeBoatConfig.hasSteersperson && (
            <Box sx={{ maxWidth: 220, mx: "auto", mb: 1.5 }}>
              <SeatCard side="steersperson" index={0} label="🛶 Leme (Capitão)" data={lineup.steersperson} isSpecial />
            </Box>
          )}

          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "var(--accent-pink-soft)", px: 2, py: 0.5, borderRadius: 10, border: "1px solid var(--border-glass)" }}>
            <Typography variant="caption" sx={{ color: "var(--accent-pink)", fontWeight: 800, letterSpacing: 1.5 }}>
              ▼ POPA (TRÁS)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
