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
import type { UpdateTaskDto, Task } from "@/types/task.types";

interface EditTaskFormProps {
  initialData: Task;
  onSubmit: (payload: UpdateTaskDto) => void;
  onCancel: () => void;
}

export default function EditTaskForm({ initialData, onSubmit, onCancel }: EditTaskFormProps) {
  // Pré-remplissage : on prend la partie date YYYY-MM-DD à partir des ISO
  const isoStart = initialData.startDate ? initialData.startDate.slice(0, 10) : "";
  const isoEnd = initialData.endDate ? initialData.endDate.slice(0, 10) : "";

  const [label, setLabel] = useState(initialData.label);
  const [description, setDescription] = useState(initialData.description ?? "");
  const [startDate, setStartDate] = useState(isoStart);
  const [endDate, setEndDate] = useState(isoEnd);
  const [statut, setStatut] = useState(initialData.statut ?? "À faire");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!label || label.trim().length === 0) e.label = "Le libellé est requis";
    if (label && label.length > 250) e.label = "Le libellé ne peut pas dépasser 250 caractères";

    if (!startDate) e.startDate = "La date de début est requise";
    if (!endDate) e.endDate = "La date de fin est requise";

    if (startDate && endDate) {
      const s = new Date(startDate);
      const ed = new Date(endDate);
      if (ed < s) e.endDate = "La date de fin doit être postérieure à la date de début";
    }

    // Pour l'édition on n'impose pas startDate >= today (optionnel)
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload: UpdateTaskDto = {
      id: initialData.id,
      label: label.trim(),
      description: description?.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      projectId: initialData.projectId,
      statut: statut || "À faire",
    };

    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>Modifier la tâche</DialogTitle>

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

        <FormControl fullWidth margin="dense">
          <InputLabel id="edit-statut-label">Statut</InputLabel>
          <Select
            labelId="edit-statut-label"
            label="Statut"
            value={statut}
            onChange={(e) => setStatut(String(e.target.value))}
          >
            <MenuItem value="À faire">À faire</MenuItem>
            <MenuItem value="En cours">En cours</MenuItem>
            <MenuItem value="Terminé">Terminé</MenuItem>
            <MenuItem value="Bloquée">Bloquée</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#1b365f", color: "#fff" }}>
          Sauvegarder
        </Button>
      </DialogActions>
    </Box>
  );
}
