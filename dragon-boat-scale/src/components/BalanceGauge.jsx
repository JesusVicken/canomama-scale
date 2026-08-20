// src/components/BalanceGauge.jsx
import React from "react";
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Button, Stack, Chip } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SpeedIcon from "@mui/icons-material/Speed";
import { useApp } from "../context/AppContext";
import { formatNumber } from "../utils/balanceAlgorithm";

export default function BalanceGauge() {
  const { metrics, activeBoatConfig, balanceSuggestion, applyBalance } = useApp();

  const {
    totalLeft,
    totalRight,
    diffLateral,
    bowWeight,
    sternWeight,
    totalWithBoat,
    isExceeded,
    safetyPercent,
  } = metrics;

  const maxDiffRange = 25; // kg
  const clampedDiff = Math.max(-maxDiffRange, Math.min(maxDiffRange, diffLateral));
  const bubblePositionPercent = 50 - (clampedDiff / maxDiffRange) * 42;
  const isBalanced = Math.abs(diffLateral) < 1.5;

  return (
    <Card
      sx={{
        mb: 2.5,
        border: "1.5px solid var(--border-glass)",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "var(--shadow-glass)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Grid container spacing={2.5} alignItems="center">
          {/* Coluna 1: Indicador de Nível Física do Barco */}
          <Grid xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "var(--text-secondary)", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.8 }}>
                <SpeedIcon fontSize="small" sx={{ color: "var(--accent-pink)" }} />
                Nível Lateral (Esquerda x Direita)
              </Typography>
              <Chip
                size="small"
                icon={isBalanced ? <CheckCircleIcon style={{ color: "#059669" }} /> : <WarningAmberIcon style={{ color: "#d97706" }} />}
                label={
                  isBalanced
                    ? "Equilíbrio Perfeito"
                    : `${formatNumber(Math.abs(diffLateral))} kg p/ ${diffLateral > 0 ? "Esquerda" : "Direita"}`
                }
                sx={{
                  bgcolor: isBalanced ? "rgba(5,150,105,0.1)" : "rgba(217,119,6,0.1)",
                  color: isBalanced ? "var(--accent-emerald)" : "var(--accent-amber)",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  border: `1px solid ${isBalanced ? "rgba(5,150,105,0.3)" : "rgba(217,119,6,0.3)"}`,
                }}
              />
            </Box>

            {/* Tubo de Nível Virtual (Bubble Level Gauge) */}
            <Box
              sx={{
                position: "relative",
                height: 36,
                borderRadius: 18,
                bgcolor: "var(--bg-input)",
                border: "2px solid var(--border-glass)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                px: 1,
              }}
            >
              {/* Marcação de centro (Green Safe Zone) */}
              <Box
                sx={{
                  position: "absolute",
                  left: "40%",
                  width: "20%",
                  height: "100%",
                  bgcolor: "rgba(5, 150, 105, 0.15)",
                  borderLeft: "1px dashed rgba(5, 150, 105, 0.4)",
                  borderRight: "1px dashed rgba(5, 150, 105, 0.4)",
                }}
              />

              {/* Bolha de Nível Dinâmica */}
              <Box
                sx={{
                  position: "absolute",
                  left: `${bubblePositionPercent}%`,
                  transform: "translateX(-50%)",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: isBalanced
                    ? "radial-gradient(circle, #e91e63 0%, #c2185b 100%)"
                    : "radial-gradient(circle, #f59e0b 0%, #d97706 100%)",
                  boxShadow: isBalanced ? "0 0 12px rgba(194, 24, 91, 0.4)" : "0 0 12px #fbbf24",
                  transition: "left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff", opacity: 0.9 }} />
              </Box>

              {/* Labels Laterais */}
              <Typography variant="caption" sx={{ position: "absolute", left: 12, fontWeight: 800, color: "var(--accent-pink)" }}>
                ESQUERDA ({formatNumber(totalLeft)}kg)
              </Typography>
              <Typography variant="caption" sx={{ position: "absolute", right: 12, fontWeight: 800, color: "var(--accent-pink)" }}>
                DIREITA ({formatNumber(totalRight)}kg)
              </Typography>
            </Box>

            {/* Balanço Longitudinal (Proa x Popa) */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                ⛵ Proa (Frente): <b>{formatNumber(bowWeight)} kg</b>
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                🛶 Popa (Trás): <b>{formatNumber(sternWeight)} kg</b>
              </Typography>
            </Stack>
          </Grid>

          {/* Coluna 2: Capacidade de Carga & Sugestão de Troca */}
          <Grid xs={12} md={6}>
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ color: "var(--text-secondary)", fontWeight: 700 }}>
                  Capacidade Total do Barco
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: isExceeded ? "var(--accent-rose)" : "var(--accent-pink)" }}>
                  {formatNumber(totalWithBoat)} kg / {formatNumber(activeBoatConfig.maxCapacity)} kg ({safetyPercent}%)
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={safetyPercent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "var(--bg-input)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    background: isExceeded
                      ? "linear-gradient(90deg, #f43f5e 0%, #dc2626 100%)"
                      : safetyPercent > 85
                      ? "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)"
                      : "linear-gradient(90deg, #c2185b 0%, #e91e63 100%)",
                  },
                }}
              />
            </Box>

            {/* Smart Auto-Balance Recommendation Card */}
            {balanceSuggestion ? (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "14px",
                  bgcolor: "var(--accent-pink-soft)",
                  border: "1px dashed var(--border-glass)",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "var(--accent-pink)", fontWeight: 800, textTransform: "uppercase" }}>
                    💡 Sugestão Inteligente de Equilíbrio
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.3, mt: 0.2 }}>
                    {balanceSuggestion.type === "swap" ? (
                      <>
                        Trocar <b>{balanceSuggestion.leftPerson.name || "Remador"}</b> ({balanceSuggestion.leftPerson.weight}kg, Esq) ↔{" "}
                        <b>{balanceSuggestion.rightPerson.name || "Remador"}</b> ({balanceSuggestion.rightPerson.weight}kg, Dir)
                      </>
                    ) : (
                      <>
                        Mover <b>{balanceSuggestion.person.name || "Remador"}</b> ({balanceSuggestion.person.weight}kg) do lado{" "}
                        {balanceSuggestion.side === "left" ? "Esquerdo para o Direito" : "Direito para o Esquerdo"}
                      </>
                    )}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontStyle: "italic", fontWeight: 600 }}>
                    Reduz a diferença para {formatNumber(balanceSuggestion.postDiff)} kg!
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  onClick={applyBalance}
                  startIcon={<SwapHorizIcon />}
                  sx={{
                    background: "var(--gradient-pink)",
                    color: "#ffffff",
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: "10px",
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Auto-Equilibrar
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: "12px",
                  bgcolor: "rgba(5, 150, 105, 0.08)",
                  border: "1px solid rgba(5, 150, 105, 0.2)",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "var(--accent-emerald)", fontWeight: 700 }}>
                  ⚖️ O barco está com peso bem distribuído!
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
