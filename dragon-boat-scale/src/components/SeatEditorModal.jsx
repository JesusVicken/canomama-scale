// src/components/SeatEditorModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import { useApp } from "../context/AppContext";

export default function SeatEditorModal({ seatInfo, onClose }) {
  const { roster, assignAthleteToSeat, saveAthleteToRoster, clearSeat, updateSeat, updateSpecialSeat } = useApp();

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [saveToRoster, setSaveToRoster] = useState(true);
  const [showRosterList, setShowRosterList] = useState(false);

  useEffect(() => {
    if (seatInfo?.data) {
      setName(seatInfo.data.name || "");
      setWeight(seatInfo.data.weight || "");
    }
  }, [seatInfo]);

  if (!seatInfo) return null;

  const { side, index, label, data } = seatInfo;

  const handleSaveManual = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Aloca o participante no assento
    if (side === "drummer" || side === "steersperson") {
      updateSpecialSeat(side, "name", name);
      updateSpecialSeat(side, "weight", weight);
    } else {
      updateSeat(side, index, "name", name);
      updateSeat(side, index, "weight", weight);
    }

    // Salva no cadastro se a opção estiver marcada
    if (saveToRoster && name.trim()) {
      const prefSide = side === "left" ? "left" : side === "right" ? "right" : "both";
      saveAthleteToRoster(name, weight, prefSide);
    }

    onClose();
  };

  const handleSelectFromRoster = (athlete) => {
    assignAthleteToSeat(side, index, athlete);
    onClose();
  };

  const handleClear = () => {
    clearSeat(side, index);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(seatInfo)}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: "#ffffff",
          color: "var(--text-primary)",
          borderRadius: "24px",
          border: "2px solid var(--border-glass)",
          boxShadow: "var(--shadow-glass)",
          m: 2,
        },
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: "var(--accent-pink-soft)",
              color: "var(--accent-pink)",
              fontWeight: 800,
              border: "1px solid var(--border-glass)",
            }}
          />
          <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--accent-pink)", fontSize: "1.15rem" }}>
            Escalar Assento
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "var(--text-muted)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, pt: 1 }}>
        {/* Entrada Manual Direta do Participante */}
        <Box component="form" onSubmit={handleSaveManual} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nome do Participante"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome..."
            autoFocus
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-primary)", bgcolor: "var(--bg-input)", borderRadius: "12px" },
              "& .MuiInputLabel-root": { color: "var(--text-secondary)", fontWeight: 600 },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border-glass)" },
            }}
          />

          <TextField
            label="Peso (kg)"
            size="small"
            type="tel"
            fullWidth
            inputProps={{ inputMode: "decimal" }}
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(",", "."))}
            placeholder="Ex: 72.5"
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-primary)", bgcolor: "var(--bg-input)", borderRadius: "12px" },
              "& .MuiInputLabel-root": { color: "var(--text-secondary)", fontWeight: 600 },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border-glass)" },
            }}
          />

          {/* Opção para Salvar no Cadastro */}
          <FormControlLabel
            control={
              <Checkbox
                checked={saveToRoster}
                onChange={(e) => setSaveToRoster(e.target.checked)}
                sx={{
                  color: "var(--accent-pink)",
                  "&.Mui-checked": { color: "var(--accent-pink)" },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                💾 Salvar este atleta no meu cadastro para treinos futuros
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            disabled={!name.trim()}
            sx={{
              background: "var(--gradient-pink)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.95rem",
              borderRadius: "14px",
              py: 1.2,
              boxShadow: "var(--shadow-glow)",
              textTransform: "none",
            }}
          >
            Confirmar Participante
          </Button>
        </Box>

        {/* Selecionar de Atletas Salvos no Cadastro (Se houver atletas salvos) */}
        {roster.length > 0 && (
          <Box sx={{ mt: 2.5 }}>
            <Divider sx={{ mb: 1.5 }} />

            <Button
              variant="text"
              size="small"
              fullWidth
              onClick={() => setShowRosterList(!showRosterList)}
              startIcon={<BookmarkAddIcon />}
              sx={{ color: "var(--accent-pink)", fontWeight: 700, textTransform: "none" }}
            >
              {showRosterList ? "Ocultar Cadastro Salvo" : `Ou Escolher do Cadastro Salvo (${roster.length})`}
            </Button>

            {showRosterList && (
              <List sx={{ maxHeight: 180, overflowY: "auto", py: 1 }}>
                {roster.map((ath) => (
                  <ListItemButton
                    key={ath.id}
                    onClick={() => handleSelectFromRoster(ath)}
                    sx={{
                      borderRadius: "12px",
                      mb: 0.8,
                      bgcolor: "var(--bg-input)",
                      border: "1px solid var(--border-subtle)",
                      "&:hover": {
                        bgcolor: "var(--accent-pink-soft)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "var(--accent-pink)", color: "#ffffff", fontWeight: 800, width: 32, height: 32, fontSize: "0.8rem" }}>
                        {ath.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={ath.name}
                      secondary={`${ath.weight ? `${ath.weight} kg` : "Sem peso"}`}
                      primaryTypographyProps={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}
                      secondaryTypographyProps={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>

      {data?.name && (
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
          <Button
            size="small"
            color="error"
            onClick={handleClear}
            startIcon={<DeleteOutlineIcon />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Desocupar este assento
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
