"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import type { CreateTaskDto } from "@/types/task.types";

/**
 * Props:
 * - projectId: id du projet auquel rattacher la tâche (pré-rempli côté modal)
 * - onSubmit: appelé avec CreateTaskDto quand la validation passe
 * - onCancel: annuler / fermer le modal
 */
interface CreateTaskFormProps {
  projectId: number;
  onSubmit: (payload: CreateTaskDto) => void;
  onCancel: () => void;
  initialValues?: Partial<CreateTaskDto>; // optionnel (utile pour tests)
}

export default function CreateTaskForm({ projectId, onSubmit, onCancel, initialValues }: CreateTaskFormProps) {
  // State du formulaire
  const [label, setLabel] = useState(initialValues?.label ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [startDate, setStartDate] = useState(initialValues?.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(initialValues?.endDate?.slice(0, 10) ?? "");
  const [statut, setStatut] = useState(initialValues?.statut ?? "À faire");

  // erreurs simples côté client
  const [errors, setErrors] = useState<Record<string, string>>({});

  // validator: retourne true si ok, sinon met errors et false
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!label || label.trim().length === 0) e.label = "Le libellé est requis";
    if (label && label.length > 250) e.label = "Le libellé ne peut pas dépasser 250 caractères";

    if (!startDate) e.startDate = "La date de début est requise";
    if (!endDate) e.endDate = "La date de fin est requise";

    // comparer dates (les inputs date renvoient 'YYYY-MM-DD')
    if (startDate && endDate) {
      const s = new Date(startDate);
      const eDate = new Date(endDate);
      if (eDate < s) e.endDate = "La date de fin doit être postérieure à la date de début";
    }

    // startDate >= today (création)
    if (startDate) {
      const s = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (s < today) e.startDate = "La date de début ne peut pas être dans le passé";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    // Construire le payload au format attendu par l'API (ISO)
    const payload: CreateTaskDto = {
      label: label.trim(),
      description: description?.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      projectId,
      statut: statut || "À faire",
    };

    onSubmit(payload);
    // notons que le parent (modal) doit fermer / recharger la liste
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>Créer une tâche</DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Libellé"
          name="label"
          fullWidth
          required
          margin="dense"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          error={!!errors.label}
          helperText={errors.label}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          label="Date de début"
          name="startDate"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={!!errors.startDate}
          helperText={errors.startDate}
        />

        <TextField
          label="Date de fin"
          name="endDate"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          error={!!errors.endDate}
          helperText={errors.endDate}
        />

        <FormControl fullWidth margin="dense" error={!!errors.statut}>
          <InputLabel id="statut-label">Statut</InputLabel>
          <Select
            labelId="statut-label"
            label="Statut"
            value={statut}
            onChange={(e) => setStatut(String(e.target.value))}
          >
            <MenuItem value="À faire">À faire</MenuItem>
            <MenuItem value="En cours">En cours</MenuItem>
            <MenuItem value="Terminé">Terminé</MenuItem>
            <MenuItem value="Bloquée">Bloquée</MenuItem>
          </Select>
          {errors.statut && <FormHelperText>{errors.statut}</FormHelperText>}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#1b365f", color: "#fff" }}>
          Créer
        </Button>
      </DialogActions>
    </Box>
  );
}
