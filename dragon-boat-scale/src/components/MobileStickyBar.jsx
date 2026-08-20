// src/components/MobileStickyBar.jsx
import React from "react";
import { Box, Typography, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useApp } from "../context/AppContext";
import { formatNumber } from "../utils/balanceAlgorithm";

export default function MobileStickyBar({ onOpenExport }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { metrics, balanceSuggestion, applyBalance } = useApp();

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        p: 1.5,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "2px solid var(--border-glass)",
        boxShadow: "0 -6px 20px rgba(194, 24, 91, 0.12)",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Box>
          <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", lineHeight: 1, fontWeight: 600 }}>
            Carga c/ Barco
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: metrics.isExceeded ? "var(--accent-rose)" : "var(--accent-pink)" }}>
            {formatNumber(metrics.totalWithBoat)} kg
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {balanceSuggestion && (
            <Button
              variant="contained"
              size="small"
              onClick={applyBalance}
              startIcon={<SwapHorizIcon />}
              sx={{
                background: "var(--gradient-pink)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.78rem",
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Equilibrar
            </Button>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={onOpenExport}
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: "#25D366",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.78rem",
              borderRadius: "12px",
              textTransform: "none",
            }}
          >
            Enviar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
