// src/components/BoatVisualizer.jsx
import React from "react";
import { Box, Typography, Grid, IconButton, Chip, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "../context/AppContext";
import { parseWeight, formatNumber } from "../utils/balanceAlgorithm";

// Ilustração SVG estilizada da Cabeça do Dragão (Proa)
const DragonHeadSVG = () => (
  <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 4C24 12 16 20 16 32C16 44 24 52 32 60C40 52 48 44 48 32C48 20 40 12 32 4Z"
      fill="url(#dragonHeadGradient)"
    />
    <circle cx="26" cy="24" r="3" fill="#ffffff" />
    <circle cx="38" cy="24" r="3" fill="#ffffff" />
    <circle cx="26" cy="24" r="1.5" fill="#c2185b" />
    <circle cx="38" cy="24" r="1.5" fill="#c2185b" />
    <path d="M22 38C28 42 36 42 42 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    <path d="M28 8L32 2L36 8" stroke="#e91e63" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="dragonHeadGradient" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e91e63" />
        <stop offset="1" stopColor="#c2185b" />
      </linearGradient>
    </defs>
  </svg>
);

// Ilustração SVG estilizada da Cauda do Dragão (Popa)
const DragonTailSVG = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 60C20 48 12 36 12 24C12 12 24 4 32 4C40 4 52 12 52 24C52 36 44 48 32 60Z"
      fill="url(#dragonTailGradient)"
    />
    <path d="M32 12V48" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />
    <path d="M20 28C26 34 38 34 44 28" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 40C28 44 36 44 42 40" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="dragonTailGradient" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c2185b" />
        <stop offset="1" stopColor="#9e1147" />
      </linearGradient>
    </defs>
  </svg>
);

export default function BoatVisualizer({ onSelectSeat }) {
  const { lineup, activeBoatConfig, clearSeat } = useApp();

  // Componente de Assento Individual (Totalmente Centralizado e Intuitivo)
  const SeatCard = ({ side, index, label, data, isSpecial }) => {
    const hasName = Boolean(data?.name && data.name.trim() !== "");
    const weightNum = parseWeight(data?.weight);

    return (
      <Box
        onClick={() => onSelectSeat({ side, index, data, label })}
        sx={{
          height: "100%",
          p: { xs: 0.9, sm: 1.2 },
          borderRadius: { xs: "12px", sm: "14px" },
          background: hasName ? "#ffffff" : "#fdf2f8",
          border: `1.5px solid ${hasName ? "var(--accent-pink)" : "rgba(194, 24, 91, 0.2)"}`,
          boxShadow: hasName ? "0 4px 12px rgba(194, 24, 91, 0.12)" : "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          "&:hover": {
            borderColor: "var(--accent-pink)",
            bgcolor: "#fce7f3",
          },
        }}
      >
        {/* Header do Assento */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
          <Chip
            label={label}
            size="small"
            sx={{
              height: { xs: 18, sm: 20 },
              fontSize: { xs: "0.62rem", sm: "0.68rem" },
              fontWeight: 800,
              px: { xs: 0.2, sm: 0.5 },
              bgcolor: isSpecial ? "rgba(194, 24, 91, 0.18)" : "rgba(194, 24, 91, 0.1)",
              color: "var(--accent-pink)",
              border: "1px solid rgba(194, 24, 91, 0.3)",
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
              width: { xs: 28, sm: 34 },
              height: { xs: 28, sm: 34 },
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
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
                fontSize: { xs: "0.78rem", sm: "0.88rem" },
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

  const halfRows = Math.floor(activeBoatConfig.rows / 2);

  return (
    <Box sx={{ width: "100%", position: "relative", my: 2 }}>
      {/* Desenho do Casco do Barco (Hull Container Centrado) */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          p: { xs: 1.5, sm: 2.5 },
          borderRadius: { xs: "24px", sm: "32px" },
          background: "linear-gradient(180deg, #ffffff 0%, #fdf2f8 50%, #ffffff 100%)",
          border: "2.5px solid var(--border-glass)",
          boxShadow: "var(--shadow-glass)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* ================= PROA (FRENTE DO BARCO) ================= */}
        <Box sx={{ textAlign: "center", mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Ilustração da Cabeça do Dragão */}
          <Box sx={{ mb: 0.5 }}>
            <DragonHeadSVG />
          </Box>

          {/* Banner de Destaque da PROA */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "var(--accent-pink)",
              color: "#ffffff",
              px: 3,
              py: 0.7,
              borderRadius: 10,
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.5, fontSize: { xs: "0.78rem", sm: "0.85rem" } }}>
              ▲ PROA (FRENTE DO BARCO)
            </Typography>
          </Box>

          {/* Assento Especial: Tamborilheiro */}
          {activeBoatConfig.hasDrummer && (
            <Box sx={{ maxWidth: { xs: 220, sm: 240 }, width: "100%", mx: "auto", mt: 1.5 }}>
              <SeatCard side="drummer" index={0} label="🥁 Tamborilheiro" data={lineup.drummer} isSpecial />
            </Box>
          )}
        </Box>

        {/* ================= CABEÇALHO DOS LADOS (ESQUERDA X DIREITA) ================= */}
        <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center" sx={{ mb: 1.5 }}>
          <Grid xs={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.2,
                py: 0.6,
                bgcolor: "var(--accent-pink-soft)",
                borderRadius: "12px",
                border: "1px solid var(--border-glass)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "var(--accent-pink)", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                👈 ESQUERDA
              </Typography>
              <Chip label={`${formatNumber(leftTotalWeight)} kg`} size="small" sx={{ height: 20, fontSize: "0.68rem", bgcolor: "var(--accent-pink)", color: "#ffffff", fontWeight: 800 }} />
            </Box>
          </Grid>

          <Grid xs={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.2,
                py: 0.6,
                bgcolor: "var(--accent-pink-soft)",
                borderRadius: "12px",
                border: "1px solid var(--border-glass)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "var(--accent-pink)", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                DIREITA 👉
              </Typography>
              <Chip label={`${formatNumber(rightTotalWeight)} kg`} size="small" sx={{ height: 20, fontSize: "0.68rem", bgcolor: "var(--accent-pink)", color: "#ffffff", fontWeight: 800 }} />
            </Box>
          </Grid>
        </Grid>

        {/* ================= CORPO DA CANOA (BANCO 1 A BANCO N LADO A LADO) ================= */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.2 } }}>
          {Array.from({ length: activeBoatConfig.rows }).map((_, idx) => {
            const leftData = lineup.leftSide?.[idx];
            const rightData = lineup.rightSide?.[idx];
            const isMidpoint = idx === halfRows;

            return (
              <React.Fragment key={idx}>
                {/* Marcador do Meio do Barco (Sala de Máquinas) */}
                {isMidpoint && (
                  <Box
                    sx={{
                      my: 1,
                      py: 0.6,
                      px: 1.5,
                      bgcolor: "var(--accent-pink-soft)",
                      borderTop: "1.5px dashed var(--accent-pink)",
                      borderBottom: "1.5px dashed var(--accent-pink)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "var(--accent-pink)", letterSpacing: 1.2, fontSize: "0.72rem" }}>
                      ⚓ MEIO DO BARCO (SALA DE MÁQUINAS)
                    </Typography>
                  </Box>
                )}

                {/* Fileira Pareada Lado a Lado (Banco N • Esq | Banco N • Dir) */}
                <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center" alignItems="stretch">
                  <Grid xs={6}>
                    <SeatCard side="left" index={idx} label={`Banco ${idx + 1} • Esq`} data={leftData} />
                  </Grid>
                  <Grid xs={6}>
                    <SeatCard side="right" index={idx} label={`Banco ${idx + 1} • Dir`} data={rightData} />
                  </Grid>
                </Grid>
              </React.Fragment>
            );
          })}
        </Box>

        {/* ================= POPA (TRÁS DO BARCO / LEME) ================= */}
        <Box sx={{ textAlign: "center", mt: 2.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Assento Especial: Leme */}
          {activeBoatConfig.hasSteersperson && (
            <Box sx={{ maxWidth: { xs: 220, sm: 240 }, width: "100%", mx: "auto", mb: 1.5 }}>
              <SeatCard side="steersperson" index={0} label="🛶 Leme (Capitão)" data={lineup.steersperson} isSpecial />
            </Box>
          )}

          {/* Banner de Destaque da POPA */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "var(--accent-pink-dark)",
              color: "#ffffff",
              px: 3,
              py: 0.7,
              borderRadius: 10,
              boxShadow: "var(--shadow-glow)",
              mb: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.5, fontSize: { xs: "0.78rem", sm: "0.85rem" } }}>
              ▼ POPA (TRÁS / LEME)
            </Typography>
          </Box>

          {/* Ilustração da Cauda do Dragão */}
          <Box sx={{ mt: 0.5 }}>
            <DragonTailSVG />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
