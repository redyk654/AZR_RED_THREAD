"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import CreateTaskForm from "@/components/pages/tasks/CreateTaskForm";
import EditTaskForm from "@/components/pages/tasks/EditTaskForm";
import DialogConfirmation from "@/components/shared/DialogConfirmation";
import ModernSnackbar from "@/components/shared/ModernSnackbar";
import { getTasksByProjectId, createTask, updateTask, deleteTask } from "@/redux/actions/task/task.action";
import type { RootState } from "@/redux/store"; // adapte selon ton store
import type { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task.types";

interface TaskModalProps {
  open: boolean;
  projectId: number;
  projectName?: string;
  onClose: () => void;
}

export default function TaskModal({ open, projectId, projectName, onClose }: TaskModalProps) {
  const dispatch = useDispatch<any>();
  const current = useSelector((state: RootState) => state.task); // adapter selon ton store
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number }>({ open: false });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // load tasks when modal opens or projectId changes
  useEffect(() => {
    if (open) {
      dispatch(getTasksByProjectId(projectId)).catch((e: any) => {
        setSnackbar({ open: true, message: e.message || "Erreur de chargement", severity: "error" });
      });
    }
  }, [open, projectId, dispatch]);

  const handleCreate = async (payload: CreateTaskDto) => {
    try {
      await dispatch(createTask(payload));
      // recharger la liste du projet
      await dispatch(getTasksByProjectId(projectId));
      setSnackbar({ open: true, message: "Tâche créée", severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Erreur création", severity: "error" });
      throw err;
    }
  };

  const handleUpdate = async (payload: UpdateTaskDto) => {
    try {
      await dispatch(updateTask(payload));
      // recharger la liste du projet
      await dispatch(getTasksByProjectId(projectId));
      setEditingTask(null);
      setSnackbar({ open: true, message: "Tâche mise à jour", severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Erreur mise à jour", severity: "error" });
      throw err;
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete.id) return;
    try {
      await dispatch(deleteTask(confirmDelete.id));
      setConfirmDelete({ open: false });
      await dispatch(getTasksByProjectId(projectId));
      setSnackbar({ open: true, message: "Tâche supprimée", severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Erreur suppression", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Tâches — {projectName ?? `Projet #${projectId}`}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {current.loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Liste simple */}
            <Stack spacing={1} mb={2}>
              {current.tasks.length === 0 ? (
                <Typography>Aucune tâche trouvée pour ce projet.</Typography>
              ) : (
                current.tasks.map((t: Task) => (
                  <Box key={t.id} display="flex" justifyContent="space-between" alignItems="center" p={1} sx={{ border: "1px solid #eee", borderRadius: 1 }}>
                    <Box>
                      <Typography variant="subtitle2">{t.label}</Typography>
                      <Typography variant="caption">{t.description}</Typography>
                      <Typography variant="caption" display="block">
                        {new Date(t.startDate).toLocaleDateString()} → {new Date(t.endDate).toLocaleDateString()} · {t.statut}
                      </Typography>
                    </Box>
                    <Box>
                      <Button size="small" onClick={() => setEditingTask(t)}>Éditer</Button>
                      <Button size="small" color="error" onClick={() => setConfirmDelete({ open: true, id: t.id })}>Supprimer</Button>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>

            {/* Formulaire de création */}
            <Box mt={2}>
              <CreateTaskForm projectId={projectId} onSubmit={handleCreate} onCancel={() => {}} />
            </Box>

            {/* Modal édition */}
            <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
              {editingTask && (
                <EditTaskForm initialData={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} />
              )}
            </Dialog>

            {/* Dialog confirmation suppression */}
            <DialogConfirmation
              open={confirmDelete.open}
              message="Confirmez-vous la suppression de cette tâche ?"
              onConfirm={handleDeleteConfirmed}
              onCancel={() => setConfirmDelete({ open: false })}
            />
          </Box>
        )}
      </DialogContent>

      <ModernSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as "success" | "error" | "info" | "warning"}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Dialog>
  );
}
