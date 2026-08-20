// src/components/LineupHistoryModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useApp } from "../context/AppContext";
import { BOAT_TYPES } from "../utils/boatConfigs";

export default function LineupHistoryModal({ open, onClose }) {
  const { savedLineups, saveCurrentLineup, loadSavedLineup, deleteSavedLineup, lineupName } = useApp();
  const [newTitle, setNewTitle] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    saveCurrentLineup(newTitle);
    setNewTitle("");
  };

  const handleLoad = (item) => {
    loadSavedLineup(item);
    onClose();
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
            Escalações Salvas ({savedLineups.length})
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
            Guarde diferentes montagens de equipe para treinos e regatas
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "var(--text-muted)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Formulário para Salvar Atual */}
        <Box component="form" onSubmit={handleSave} sx={{ display: "flex", gap: 1, mb: 2.5 }}>
          <TextField
            label="Nome da Escalação"
            size="small"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ex: Treino de Sábado - Equipe A"
            sx={{
              "& .MuiInputBase-root": { color: "var(--text-primary)", bgcolor: "var(--bg-input)" },
              "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newTitle.trim()}
            startIcon={<BookmarkAddIcon />}
            sx={{
              bgcolor: "var(--accent-cyan)",
              color: "#0f172a",
              fontWeight: 700,
              borderRadius: "10px",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            Salvar Atual
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Lista de Escalações Salvas */}
        <List sx={{ maxHeight: 300, overflowY: "auto", py: 0 }}>
          {savedLineups.length > 0 ? (
            savedLineups.map((item) => {
              const boatInfo = BOAT_TYPES[item.boatId] || BOAT_TYPES.DB20;
              const dateStr = new Date(item.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleLoad(item)}
                        startIcon={<FileUploadIcon />}
                        sx={{
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          textTransform: "none",
                          borderColor: "var(--border-glass)",
                          color: "var(--accent-cyan)",
                        }}
                      >
                        Carregar
                      </Button>
                      <IconButton onClick={() => deleteSavedLineup(item.id)} size="small" sx={{ color: "var(--text-muted)", "&:hover": { color: "var(--accent-rose)" } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    borderRadius: "12px",
                    mb: 1,
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-subtle)",
                    pr: 18,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {item.name}
                        </Typography>
                        <Chip label={boatInfo.shortName} size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }} />
                      </Box>
                    }
                    secondary={`Salvo em: ${dateStr}`}
                    secondaryTypographyProps={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
                  />
                </ListItem>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: "var(--text-muted)", py: 4, textAlign: "center" }}>
              Nenhuma escalação salva no momento.
            </Typography>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
