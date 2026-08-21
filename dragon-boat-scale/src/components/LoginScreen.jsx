// src/components/LoginScreen.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Chip,
  Container,
  Paper,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useApp } from "../context/AppContext";

export default function LoginScreen({ onLoginSuccess }) {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Preencha o usuário e a senha para continuar.");
      return;
    }

    setIsSubmitting(true);

    // Pequeno atraso para feedback tátil da UI
    setTimeout(() => {
      const res = login(username, password);
      setIsSubmitting(false);

      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setErrorMsg(res.message || "Credenciais inválidas.");
      }
    }, 400);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 4,
        background: `
          radial-gradient(circle at 50% 10%, rgba(252, 231, 243, 0.9) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(244, 114, 182, 0.15) 0%, transparent 50%),
          #fbf6f8
        `,
      }}
    >
      <Container maxWidth="xs" disableGutters sx={{ width: "100%", maxWidth: 400 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: "28px",
            bgcolor: "#ffffff",
            border: "1.5px solid var(--border-glass)",
            boxShadow: "0 16px 40px -10px rgba(194, 24, 91, 0.15)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Badge com Logo Canomama */}
          <Box
            sx={{
              position: "relative",
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Anel Glowing de Fundo */}
            <Box
              sx={{
                position: "absolute",
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "var(--accent-pink-soft)",
                filter: "blur(10px)",
                opacity: 0.8,
              }}
            />

            {/* Container da Logo */}
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                bgcolor: "#ffffff",
                border: "2.5px solid var(--accent-pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
                boxShadow: "0 6px 18px rgba(194, 24, 91, 0.2)",
                p: 1.2,
              }}
            >
              <Box
                component="img"
                src="/canoMAMAlogo1.png"
                alt="Associação Canomama Logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>

          {/* Títulos */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              color: "var(--accent-pink)",
              textAlign: "center",
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              letterSpacing: "-0.01em",
              mb: 0.5,
            }}
          >
            Associação Canomama
          </Typography>

          <Chip
            label="DRAGON BOAT TIME BRASÍLIA"
            size="small"
            sx={{
              bgcolor: "var(--accent-pink-soft)",
              color: "var(--accent-pink-dark)",
              fontWeight: 800,
              fontSize: "0.75rem",
              mb: 3,
              border: "1px solid var(--border-glass)",
            }}
          />

          {/* Alert de Erro */}
          {errorMsg && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 2.5,
                borderRadius: "14px",
                fontWeight: 600,
                fontSize: "0.85rem",
                bgcolor: "#fff1f2",
                color: "#9f1239",
                border: "1px solid #fecdd3",
              }}
            >
              {errorMsg}
            </Alert>
          )}

          {/* Formulário de Login */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  mb: 0.6,
                  display: "block",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Usuário
              </Typography>
              <TextField
                fullWidth
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                size="medium"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: "var(--accent-pink)" }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "var(--bg-input)",
                    "& fieldset": { borderColor: "var(--border-glass)" },
                    "&:hover fieldset": { borderColor: "var(--accent-pink)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--accent-pink)", borderWidth: 2 },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  mb: 0.6,
                  display: "block",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Senha
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="medium"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "var(--accent-pink)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "var(--text-muted)" }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: "var(--bg-input)",
                    "& fieldset": { borderColor: "var(--border-glass)" },
                    "&:hover fieldset": { borderColor: "var(--accent-pink)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--accent-pink)", borderWidth: 2 },
                  },
                }}
              />
            </Box>

            {/* Botão Principal de Login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: "18px",
                background: "var(--gradient-pink)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 8px 24px rgba(194, 24, 91, 0.3)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 10px 28px rgba(194, 24, 91, 0.4)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {isSubmitting ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
          </Box>
        </Paper>

        {/* Rodapé Mobile */}
      </Container>
    </Box>
  );
}
