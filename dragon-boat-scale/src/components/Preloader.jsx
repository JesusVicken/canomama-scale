// src/components/Preloader.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Preloader({ loading }) {
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s ease, visibility 0.5s ease",
        opacity: loading ? 1 : 0,
        pointerEvents: loading ? "all" : "none",
      }}
    >
      {/* Container com Anel Giratório Rosa e Logo no Centro */}
      <Box
        sx={{
          position: "relative",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        {/* Anel Externo Giratório */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(194, 24, 91, 0.12)",
            borderTopColor: "var(--accent-pink)",
            borderRightColor: "var(--accent-pink-light)",
            animation: "spinRing 1.2s linear infinite",
          }}
        />

        {/* Brilho Suave de Fundo */}
        <Box
          sx={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "var(--accent-pink-soft)",
            filter: "blur(12px)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />

        {/* Logo canoMAMA no Centro */}
        <Box
          component="img"
          src="/logo.avif"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/canoMAMAlogo1.png";
          }}
          alt="Associação Canomama"
          sx={{
            width: 84,
            height: 84,
            objectFit: "contain",
            borderRadius: "50%",
            position: "relative",
            zIndex: 2,
            animation: "pulseLogo 2s ease-in-out infinite",
            filter: "drop-shadow(0 4px 12px rgba(194, 24, 91, 0.25))",
          }}
        />
      </Box>

      {/* Título & Animação de Texto */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          color: "var(--accent-pink)",
          letterSpacing: 0.5,
          fontSize: "1.25rem",
          mb: 0.5,
        }}
      >
        Associação Canomama
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "var(--text-secondary)",
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          fontSize: "0.72rem",
          animation: "pulseText 1.5s ease-in-out infinite",
        }}
      >
        Somos Canomama! 💖
      </Typography>

      {/* Barra de Progresso Suave na parte inferior */}
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          width: 120,
          height: 4,
          borderRadius: 2,
          bgcolor: "var(--accent-pink-soft)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "var(--accent-pink)",
            borderRadius: 2,
            animation: "indeterminateProgress 1.5s ease-in-out infinite",
          }}
        />
      </Box>
    </Box>
  );
}
