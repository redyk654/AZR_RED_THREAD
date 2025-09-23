"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Pagination, Dialog, Box, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getPaginatedProjects, createProject, updateProject, deleteProject } from "@/redux/actions/project/project.action";
import ProjectCard from "@/components/pages/dashboard/ProjectCard";
import ProjectTable from "@/components/pages/dashboard/ProjectTable";
import ProjectListSwitcher from "@/components/pages/dashboard/ProjectListSwitcher";
import CreateProjectForm from "@/components/pages/projects/CreateProjectForm";
import ModernSnackbar from "@/components/shared/ModernSnackbar";
import { UpdateProjectDto } from "@/types/project.types";
import EditProjectForm from "@/components/pages/projects/EditProjectForm";
import DialogConfirmation from "@/components/shared/DialogConfirmation";
import TaskModal from "@/components/pages/tasks/TaskModal";

export default function Dashboard() {
  const dispatch = useDispatch<any>();
  const { paginated } = useSelector((state: any) => state.project);

  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [taskModal, setTaskModal] = useState({ open: false, projectId: null as number | null, projectName: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [editProject, setEditProject] = useState<UpdateProjectDto | null>(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, projectId: 0 });

  const pageSize = 4;

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await dispatch(getPaginatedProjects(page, pageSize) as any);
      if (result?.error) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "error"
        });
      }
    };
    fetchProjects();
  }, [page]);

  const handleCreate = async (data: any) => {
    const result = await dispatch(createProject(data));
    if (result?.error) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: "error"
      });
      return;
    }
    setSnackbar({ open: true, message: "Projet créé avec succès", severity: "success" });
    setOpenForm(false);
    dispatch(getPaginatedProjects(page, pageSize));
  };

  const openTasks = (project: any) => setTaskModal({ open: true, projectId: project.id, projectName: project.name });

  const handleOpenEdit = (project: UpdateProjectDto) => {
    setEditProject(project);
    setOpenEdit(true);
  };

  const handleEditSubmit = async (data: UpdateProjectDto) => {
    data.updatedBy = 1; // TODO: remplacer par l'ID de l'utilisateur connecté
    const result = await dispatch(updateProject(data));
    if (result?.error) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: "error"
      });
      return;
    }
    setSnackbar({ open: true, message: "Projet mis à jour avec succès", severity: "success" });
    dispatch(getPaginatedProjects(page, pageSize)); // refresh liste
  };

  const handleOpenDelete = (id: number) => {
    setConfirmDelete({ open: true, projectId: id });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.projectId) return;
    try {
      await dispatch(deleteProject(confirmDelete.projectId));
      setSnackbar({ open: true, message: "Projet supprimé", severity: "success" });
      dispatch(getPaginatedProjects(page, pageSize));
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
    setConfirmDelete({ open: false, projectId: 0 });
  };

  return (
    <div>
      <ProjectListSwitcher viewMode={viewMode} onChange={setViewMode} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', m: 2 }}>
        <Button sx={{ bgcolor: "#1b365f", color: "#fff", ml: 2 }} onClick={() => setOpenForm(true)}>
          Nouveau Projet
        </Button>
      </Box>

      {viewMode === "card" ? (
        <Grid container spacing={3} mt={2}>
          {paginated.data.map((project: any) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard
                project={project}
                onEdit={() => handleOpenEdit(project)}
                onDelete={() => handleOpenDelete(project.id)}
                onViewTasks={() => openTasks(project)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ProjectTable
          projects={paginated.data}
          onEdit={handleOpenEdit}
          onDelete={handleConfirmDelete}
          onViewTasks={openTasks}
        />
      )}

      <Pagination
        count={Math.ceil((paginated.total || 0) / pageSize)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 3 }}
      />

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        {editProject && (
          <EditProjectForm
            initialData={editProject}
            onSubmit={handleEditSubmit}
            onCancel={() => setOpenEdit(false)}
          />
        )}
      </Dialog>

      <DialogConfirmation
        open={confirmDelete.open}
        message="Voulez-vous vraiment supprimer ce projet ?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, projectId: 0 })}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>
          Créer un nouveau projet
          <IconButton onClick={() => setOpenForm(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <CreateProjectForm onSubmit={handleCreate} />
      </Dialog>

      {taskModal.projectId && (
        <TaskModal
          open={taskModal.open}
          projectId={taskModal.projectId}
          projectName={taskModal.projectName}
          onClose={() => setTaskModal({ open: false, projectId: null, projectName: "" })}
        />
      )}

      <ModernSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as "success" | "error" | "info" | "warning"}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
}
