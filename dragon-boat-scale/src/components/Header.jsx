// src/components/Header.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useApp } from "../context/AppContext";
import { BOAT_TYPES } from "../utils/boatConfigs";

export default function Header({ onOpenRoster, onOpenExport, onOpenHistory }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    activeBoatId,
    setActiveBoatId,
    activeBoatConfig,
    resetLineup,
    roster,
    savedLineups,
    logout,
  } = useApp();

  const [boatMenuAnchor, setBoatMenuAnchor] = useState(null);

  const handleOpenBoatMenu = (e) => setBoatMenuAnchor(e.currentTarget);
  const handleCloseBoatMenu = () => setBoatMenuAnchor(null);

  const handleSelectBoat = (id) => {
    setActiveBoatId(id);
    handleCloseBoatMenu();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#ffffff",
        borderBottom: "2px solid var(--border-subtle)",
        boxShadow: "0 4px 20px rgba(194, 24, 91, 0.06)",
        color: "var(--text-primary)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 0.8, px: { xs: 1.5, sm: 3 } }}>
        {/* Brand Logo & Title (Associação Canomama Style) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src="/canoMAMAlogo1.png"
            alt="Associação Canomama"
            sx={{
              height: { xs: 36, sm: 44 },
              width: "auto",
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: { xs: "1.05rem", sm: "1.35rem" },
                color: "var(--accent-pink)",
                lineHeight: 1.1,
              }}
            >
              Associação Canomama <span style={{ fontSize: "0.75em", fontWeight: 600, color: "var(--text-primary)" }}>Scale</span>
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--accent-pink)", fontWeight: 800, letterSpacing: 0.5, display: "block" }}>
              Somos Canomama! 💖
            </Typography>
          </Box>
        </Box>

        {/* Boat Selector Button */}
        <Box>
          <Button
            variant="outlined"
            onClick={handleOpenBoatMenu}
            endIcon={<KeyboardArrowDownIcon />}
            startIcon={<span style={{ fontSize: "1.2rem" }}>{activeBoatConfig.icon}</span>}
            sx={{
              borderRadius: "20px",
              borderColor: "var(--border-glass)",
              color: "var(--accent-pink)",
              bgcolor: "var(--bg-input)",
              textTransform: "none",
              fontWeight: 800,
              px: { xs: 1.5, sm: 2 },
              py: 0.5,
              fontSize: { xs: "0.82rem", sm: "0.9rem" },
              "&:hover": {
                borderColor: "var(--accent-pink)",
                bgcolor: "var(--accent-pink-soft)",
              },
            }}
          >
            {isMobile ? activeBoatConfig.shortName : activeBoatConfig.name}
          </Button>

          <Menu
            anchorEl={boatMenuAnchor}
            open={Boolean(boatMenuAnchor)}
            onClose={handleCloseBoatMenu}
            PaperProps={{
              sx: {
                bgcolor: "#ffffff",
                color: "var(--text-primary)",
                border: "1.5px solid var(--border-glass)",
                borderRadius: "16px",
                mt: 1,
                boxShadow: "var(--shadow-glass)",
              },
            }}
          >
            {Object.values(BOAT_TYPES).map((boat) => (
              <MenuItem
                key={boat.id}
                selected={boat.id === activeBoatId}
                onClick={() => handleSelectBoat(boat.id)}
                sx={{
                  py: 1.2,
                  px: 2,
                  display: "flex",
                  gap: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "var(--accent-pink-soft)",
                    fontWeight: 700,
                  },
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{boat.icon}</span>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--accent-pink)" }}>
                    {boat.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                    {boat.paddlerCount} remadores • Cap. {boat.maxCapacity}kg
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          {/* Saved Lineups */}
          <Tooltip title="Escalações Salvas">
            <IconButton onClick={onOpenHistory} sx={{ color: "var(--accent-pink)" }}>
              <Badge badgeContent={savedLineups.length} color="primary">
                <BookmarkIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Roster / Athletes */}
          <Tooltip title="Cadastro de Atletas Salvos">
            <IconButton onClick={onOpenRoster} sx={{ color: "var(--accent-pink)" }}>
              <Badge badgeContent={roster.length} color="primary">
                <PeopleIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Export / Share */}
          <Button
            variant="contained"
            size="small"
            onClick={onOpenExport}
            startIcon={<ShareIcon fontSize="small" />}
            sx={{
              borderRadius: "20px",
              background: "var(--gradient-pink)",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 800,
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
              display: { xs: "none", sm: "inline-flex" },
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Exportar
          </Button>

          <IconButton
            onClick={onOpenExport}
            sx={{ color: "var(--accent-pink)", display: { xs: "inline-flex", sm: "none" } }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>

          {/* Reset Lineup */}
          <Tooltip title="Limpar Escalação">
            <IconButton onClick={resetLineup} sx={{ color: "var(--text-muted)", "&:hover": { color: "var(--accent-rose)" } }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Logout */}
          <Tooltip title="Sair do Sistema">
            <IconButton onClick={logout} sx={{ color: "var(--text-muted)", "&:hover": { color: "var(--accent-pink)" } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
