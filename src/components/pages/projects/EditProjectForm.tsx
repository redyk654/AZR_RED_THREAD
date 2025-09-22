"use client";

import { useState } from "react";
import { TextField, Button, Box, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { UpdateProjectDto } from "@/types/project.types";

interface EditProjectFormProps {
  initialData: UpdateProjectDto;
  onSubmit: (data: UpdateProjectDto) => void;
  onCancel: () => void;
}

export default function EditProjectForm({ initialData, onSubmit, onCancel }: EditProjectFormProps) {
  const [formData, setFormData] = useState({ ...initialData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>Modifier le projet</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Nom du projet"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Date de début"
          name="startDate"
          type="date"
          value={formData.startDate.split("T")[0]}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          label="Date de fin"
          name="endDate"
          type="date"
          value={formData.endDate.split("T")[0]}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
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
