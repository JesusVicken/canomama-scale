// src/components/RosterModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useApp } from "../context/AppContext";

export default function RosterModal({ open, onClose }) {
  const { roster, addAthleteToRoster, deleteAthleteFromRoster } = useApp();

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [sidePreference, setSidePreference] = useState("both");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAthleteToRoster({ name, weight: weight.replace(",", "."), sidePreference });
    setName("");
    setWeight("");
    setSidePreference("both");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          borderRadius: "24px",
          border: "1px solid var(--border-glass)",
          boxShadow: "var(--shadow-glass)",
        },
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            Elenco de Atletas ({roster.length})
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
            Cadastre os remadores da equipe para escalação com 1 toque
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "var(--text-muted)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Formulário de Novo Atleta */}
        <Box
          component="form"
          onSubmit={handleAdd}
          sx={{
            p: 2,
            borderRadius: "16px",
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-subtle)",
            mb: 2.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: "var(--accent-cyan)" }}>
            + Cadastrar Novo Atleta
          </Typography>

          <Grid container spacing={1.5}>
            <Grid xs={12} sm={5}>
              <TextField
                label="Nome do Atleta"
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lucas Silva"
                sx={{
                  "& .MuiInputBase-root": { color: "var(--text-primary)", bgcolor: "var(--bg-input)" },
                  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                }}
              />
            </Grid>

            <Grid xs={6} sm={3}>
              <TextField
                label="Peso (kg)"
                size="small"
                type="tel"
                fullWidth
                value={weight}
                onChange={(e) => setWeight(e.target.value.replace(",", "."))}
                placeholder="Ex: 78"
                sx={{
                  "& .MuiInputBase-root": { color: "var(--text-primary)", bgcolor: "var(--bg-input)" },
                  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                }}
              />
            </Grid>

            <Grid xs={6} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ color: "var(--text-secondary)" }}>Lado Preferido</InputLabel>
                <Select
                  value={sidePreference}
                  label="Lado Preferido"
                  onChange={(e) => setSidePreference(e.target.value)}
                  sx={{ color: "var(--text-primary)", bgcolor: "var(--bg-input)" }}
                >
                  <MenuItem value="left">👈 Esquerda</MenuItem>
                  <MenuItem value="right">👉 Direita</MenuItem>
                  <MenuItem value="both">🔄 Ambos Lados</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                startIcon={<PersonAddIcon />}
                disabled={!name.trim()}
                sx={{
                  bgcolor: "var(--accent-cyan)",
                  color: "#0f172a",
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none",
                }}
              >
                Adicionar Atleta ao Elenco
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Lista de Atletas Cadastrados */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "var(--text-secondary)" }}>
          Atletas Cadastrados
        </Typography>

        <List sx={{ maxHeight: 300, overflowY: "auto", py: 0 }}>
          {roster.map((athlete) => (
            <ListItem
              key={athlete.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteAthleteFromRoster(athlete.id)} sx={{ color: "var(--text-muted)", "&:hover": { color: "var(--accent-rose)" } }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                borderRadius: "12px",
                mb: 1,
                bgcolor: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "var(--accent-cyan)", color: "#0f172a", fontWeight: 700 }}>
                  {athlete.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={athlete.name}
                secondary={`${athlete.weight ? `${athlete.weight} kg` : "Sem peso"} • ${
                  athlete.sidePreference === "left"
                    ? "👈 Esquerda"
                    : athlete.sidePreference === "right"
                    ? "👉 Direita"
                    : "🔄 Ambos Lados"
                }`}
                primaryTypographyProps={{ fontWeight: 600, color: "var(--text-primary)" }}
                secondaryTypographyProps={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
