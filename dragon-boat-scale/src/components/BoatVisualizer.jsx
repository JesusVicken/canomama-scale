// src/components/BoatVisualizer.jsx
import React from "react";
import { Box, Typography, Grid, IconButton, Chip, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "../context/AppContext";
import { parseWeight, formatNumber } from "../utils/balanceAlgorithm";

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
        {/* ================= PROA (FRENTE DO BARCO - CABEÇA DE DRAGÃO REAIS) ================= */}
        <Box sx={{ textAlign: "center", mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Imagem Real da Cabeça do Dragão da Proa */}
          <Box
            component="img"
            src="/dragon_head.png"
            alt="Proa Cabeça do Dragão"
            sx={{
              height: { xs: 55, sm: 70 },
              width: "auto",
              objectFit: "contain",
              transform: "rotate(90deg)", // Aponta para CIMA (Proa)
              filter: "drop-shadow(0 4px 10px rgba(194, 24, 91, 0.3))",
              mb: 1,
            }}
          />

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

        {/* ================= POPA (TRÁS DO BARCO / LEME - CAUDA DE DRAGÃO REAIS) ================= */}
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
              mb: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.5, fontSize: { xs: "0.78rem", sm: "0.85rem" } }}>
              ▼ POPA (TRÁS / LEME)
            </Typography>
          </Box>

          {/* Imagem Real da Cauda do Dragão da Popa */}
          <Box
            component="img"
            src="/dragon_tail.png"
            alt="Popa Cauda do Dragão"
            sx={{
              height: { xs: 50, sm: 65 },
              width: "auto",
              objectFit: "contain",
              transform: "rotate(90deg)", // Aponta para BAIXO (Popa)
              filter: "drop-shadow(0 4px 10px rgba(194, 24, 91, 0.3))",
              mt: 0.5,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
