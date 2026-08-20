// src/components/BoatVisualizer.jsx
import React from "react";
import { Box, Typography, Grid, IconButton, Chip, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "../context/AppContext";
import { parseWeight, formatNumber } from "../utils/balanceAlgorithm";

export default function BoatVisualizer({ onSelectSeat }) {
  const { lineup, activeBoatConfig, clearSeat } = useApp();

  // Componente de Assento Individual (Otimizado para Touch Mobile Lado a Lado)
  const SeatCard = ({ side, index, label, data, isSpecial }) => {
    const hasName = Boolean(data?.name && data.name.trim() !== "");
    const weightNum = parseWeight(data?.weight);

    return (
      <Box
        onClick={() => onSelectSeat({ side, index, data, label })}
        sx={{
          height: "100%",
          p: { xs: 0.8, sm: 1.2 },
          borderRadius: { xs: "12px", sm: "14px" },
          background: hasName ? "#ffffff" : "#fdf2f8",
          border: `1.5px solid ${hasName ? "var(--accent-pink)" : "rgba(194, 24, 91, 0.18)"}`,
          boxShadow: hasName ? "0 3px 12px rgba(194, 24, 91, 0.1)" : "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "&:hover": {
            transform: "translateY(-1px)",
            borderColor: "var(--accent-pink)",
            bgcolor: "#fce7f3",
          },
        }}
      >
        {/* Top bar do assento */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
          <Chip
            label={label}
            size="small"
            sx={{
              height: { xs: 18, sm: 20 },
              fontSize: { xs: "0.62rem", sm: "0.68rem" },
              fontWeight: 800,
              px: { xs: 0.2, sm: 0.5 },
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
              <CloseIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
            </IconButton>
          )}
        </Box>

        {/* Conteúdo do Atleta */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.6, sm: 1 }, mt: 0.8 }}>
          <Avatar
            sx={{
              width: { xs: 26, sm: 32 },
              height: { xs: 26, sm: 32 },
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              fontWeight: 800,
              bgcolor: hasName ? "var(--accent-pink)" : "#fbcfe8",
              color: hasName ? "#ffffff" : "var(--accent-pink)",
            }}
          >
            {hasName ? data.name.charAt(0).toUpperCase() : <PersonAddIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontWeight: hasName ? 800 : 600,
                color: hasName ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                lineHeight: 1.1,
              }}
            >
              {hasName ? data.name : "Preencher"}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: hasName ? "var(--accent-pink)" : "var(--text-muted)",
                fontWeight: 700,
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
                display: "block",
              }}
            >
              {hasName ? `${weightNum} kg` : "Toque aqui"}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const leftTotalWeight = (lineup.leftSide || []).reduce((a, b) => a + parseWeight(b.weight), 0);
  const rightTotalWeight = (lineup.rightSide || []).reduce((a, b) => a + parseWeight(b.weight), 0);

  return (
    <Box sx={{ width: "100%", position: "relative", my: 2 }}>
      {/* Desenho do Casco do Barco (Hull Container) */}
      <Box
        sx={{
          position: "relative",
          p: { xs: 1.5, sm: 3 },
          borderRadius: { xs: "24px", sm: "32px" },
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
            background: "linear-gradient(180deg, transparent 0%, rgba(194, 24, 91, 0.2) 20%, rgba(194, 24, 91, 0.2) 80%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* PROA (FRENTE DO BARCO) */}
        <Box sx={{ textAlign: "center", mb: 1.5 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "var(--accent-pink-soft)", px: 2, py: 0.4, borderRadius: 10, border: "1px solid var(--border-glass)" }}>
            <Typography variant="caption" sx={{ color: "var(--accent-pink)", fontWeight: 800, letterSpacing: 1.2, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
              ▲ PROA (FRENTE)
            </Typography>
          </Box>

          {/* Assento Especial: Tamborilheiro */}
          {activeBoatConfig.hasDrummer && (
            <Box sx={{ maxWidth: { xs: 200, sm: 220 }, mx: "auto", mt: 1 }}>
              <SeatCard side="drummer" index={0} label="🥁 Tamborilheiro" data={lineup.drummer} isSpecial />
            </Box>
          )}
        </Box>

        {/* CABEÇALHO DOS LADOS (ESQUERDA X DIREITA) */}
        <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 1 }}>
          <Grid xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "var(--accent-pink)", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                👈 ESQUERDA
              </Typography>
              <Chip label={`${formatNumber(leftTotalWeight)} kg`} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: "var(--accent-pink-soft)", color: "var(--accent-pink)", fontWeight: 800 }} />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "var(--accent-pink)", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                DIREITA 👉
              </Typography>
              <Chip label={`${formatNumber(rightTotalWeight)} kg`} size="small" sx={{ height: 18, fontSize: "0.62rem", bgcolor: "var(--accent-pink-soft)", color: "var(--accent-pink)", fontWeight: 800 }} />
            </Box>
          </Grid>
        </Grid>

        {/* CORPO DO BARCO: FILEIRAS LADO A LADO PAREADAS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.2 } }}>
          {Array.from({ length: activeBoatConfig.rows }).map((_, idx) => {
            const leftData = lineup.leftSide?.[idx];
            const rightData = lineup.rightSide?.[idx];

            return (
              <Grid container key={idx} spacing={{ xs: 1, sm: 2 }} alignItems="stretch">
                <Grid xs={6}>
                  <SeatCard side="left" index={idx} label={`F${idx + 1} • Esq`} data={leftData} />
                </Grid>
                <Grid xs={6}>
                  <SeatCard side="right" index={idx} label={`F${idx + 1} • Dir`} data={rightData} />
                </Grid>
              </Grid>
            );
          })}
        </Box>

        {/* POPA (TRÁS DO BARCO) */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {/* Assento Especial: Leme */}
          {activeBoatConfig.hasSteersperson && (
            <Box sx={{ maxWidth: { xs: 200, sm: 220 }, mx: "auto", mb: 1 }}>
              <SeatCard side="steersperson" index={0} label="🛶 Leme (Capitão)" data={lineup.steersperson} isSpecial />
            </Box>
          )}

          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "var(--accent-pink-soft)", px: 2, py: 0.4, borderRadius: 10, border: "1px solid var(--border-glass)" }}>
            <Typography variant="caption" sx={{ color: "var(--accent-pink)", fontWeight: 800, letterSpacing: 1.2, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}>
              ▼ POPA (TRÁS)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
