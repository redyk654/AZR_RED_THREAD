// src/components/admin/AdminPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ROLE_ENDPOINTS, PRIVILEGE_ENDPOINTS, ADMIN_USERS_ENDPOINTS } from "@/utils/constants";

/**
 * Composant AdminPanel
 * Centralise l'UI et la logique pour gérer :
 * - Roles (CRUD)
 * - Privileges (CRUD)
 * - Assignation privilège <-> rôle
 * - Assignation rôle -> utilisateur
 *
 * Utilisation : <AdminPanel />
 *
 * Notes :
 * - En dev on utilise X-Fake-UserId header. Le champ "fakeUserId" met à jour axios.defaults.headers.common["X-Fake-UserId"].
 * - En prod, remplace par Authorization Bearer.
 */

/* -------- Types locaux (alignés avec DTOs backend) -------- */
type Role = { id: number; label: string; description?: string };
type Privilege = { id: number; label: string; description?: string };
type User = { id: number; firstName?: string; lastName?: string; email?: string; roleId?: number; roleLabel?: string; isActive?: boolean };

/* -------- Composant -------- */
export default function AdminPanel() {
  // Données
  const [roles, setRoles] = useState<Role[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRolePrivileges, setSelectedRolePrivileges] = useState<Privilege[]>([]);

  // UI - Dialogs
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [openPrivDialog, setOpenPrivDialog] = useState(false);
  const [editingPriv, setEditingPriv] = useState<Privilege | null>(null);

  // Loading / snack
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({ open: false, message: "", severity: "info" });

  // Assign role to user UI
  const [assignUserId, setAssignUserId] = useState<number | "">("");
  const [assignRoleId, setAssignRoleId] = useState<number | "">("");

  // Dev helper: fake user header
  const [fakeUserId, setFakeUserId] = useState<number>(1);

  /* ----------------------- Helpers HTTP ----------------------- */

  // Met à jour le header X-Fake-UserId pour axios (dev)
  const setFakeHeader = (id?: number) => {
    if (id === undefined || id === null) {
      delete axios.defaults.headers.common["X-Fake-UserId"];
    } else {
      axios.defaults.headers.common["X-Fake-UserId"] = String(id);
    }
  };

  // Fonction utilitaire pour afficher snackbar
  const pushSnack = (message: string, severity: "success" | "error" | "info" = "info") => {
    setSnack({ open: true, message, severity });
  };

  /* ----------------------- Fetch initial ----------------------- */

  useEffect(() => {
    // set dev header by default (confort). En prod tu le retireras.
    setFakeHeader(fakeUserId);
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Récupère roles, privileges et users
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRoles, rPrivs, rUsers] = await Promise.all([
        axios.get(ROLE_ENDPOINTS.GET_ALL),
        axios.get(PRIVILEGE_ENDPOINTS.GET_ALL),
        axios.get(ADMIN_USERS_ENDPOINTS.GET_ALL),
      ]);

      setRoles(rRoles.data || []);
      setPrivileges(rPrivs.data || []);
      setUsers(rUsers.data || []);
      // reset selected role details
      setSelectedRole(null);
      setSelectedRolePrivileges([]);
    } catch (err: any) {
      console.error("fetchAll error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Roles CRUD ----------------------- */

  const openCreateRoleDialog = () => {
    setEditingRole({ id: 0, label: "", description: "" });
    setOpenRoleDialog(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setOpenRoleDialog(true);
  };

  const saveRole = async () => {
    if (!editingRole) return;
    try {
      setLoading(true);
      if (editingRole.id === 0) {
        // create
        await axios.post(ROLE_ENDPOINTS.CREATE, { label: editingRole.label, description: editingRole.description });
        pushSnack("Rôle créé", "success");
      } else {
        // update
        await axios.put(ROLE_ENDPOINTS.UPDATE(editingRole.id), { id: editingRole.id, label: editingRole.label, description: editingRole.description });
        pushSnack("Rôle mis à jour", "success");
      }
      setOpenRoleDialog(false);
      await fetchAll();
    } catch (err: any) {
      console.error("saveRole error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur sauvegarde rôle", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId: number) => {
    if (!confirm("Confirmer la suppression du rôle ?")) return;
    try {
      setLoading(true);
      await axios.delete(ROLE_ENDPOINTS.DELETE(roleId));
      pushSnack("Rôle supprimé", "success");
      await fetchAll();
    } catch (err: any) {
      console.error("deleteRole error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur suppression rôle", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Privileges CRUD ----------------------- */

  const openCreatePrivDialog = () => {
    setEditingPriv({ id: 0, label: "", description: "" });
    setOpenPrivDialog(true);
  };

  const openEditPrivDialog = (p: Privilege) => {
    setEditingPriv(p);
    setOpenPrivDialog(true);
  };

  const savePrivilege = async () => {
    if (!editingPriv) return;
    try {
      setLoading(true);
      if (editingPriv.id === 0) {
        await axios.post(PRIVILEGE_ENDPOINTS.CREATE, editingPriv);
        pushSnack("Privilège créé", "success");
      } else {
        await axios.put(PRIVILEGE_ENDPOINTS.UPDATE(editingPriv.id), editingPriv);
        pushSnack("Privilège mis à jour", "success");
      }
      setOpenPrivDialog(false);
      await fetchAll();
    } catch (err: any) {
      console.error("savePrivilege error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur sauvegarde privilège", "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePrivilege = async (privId: number) => {
    if (!confirm("Confirmer la suppression du privilège ?")) return;
    try {
      setLoading(true);
      await axios.delete(PRIVILEGE_ENDPOINTS.DELETE(privId));
      pushSnack("Privilège supprimé", "success");
      await fetchAll();
    } catch (err: any) {
      console.error("deletePrivilege error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur suppression privilège", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Role <-> Privileges ----------------------- */

  const loadRolePrivileges = async (role: Role) => {
    try {
      setSelectedRole(role);
      setLoading(true);
      const res = await axios.get(ROLE_ENDPOINTS.GET_PRIVILEGES(role.id));
      setSelectedRolePrivileges(res.data || []);
    } catch (err: any) {
      console.error("loadRolePrivileges error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur chargement privilèges rôle", "error");
    } finally {
      setLoading(false);
    }
  };

  const assignPrivilegeToRole = async (privilegeId: number) => {
    if (!selectedRole) return pushSnack("Sélectionnez d'abord un rôle", "info");
    try {
      setLoading(true);
      // endpoint: POST /admin/roles/{roleId}/assign-privilege/{privilegeId}
      await axios.post(ROLE_ENDPOINTS.ASSIGN_PRIVILEGE(selectedRole.id, privilegeId), null);
      pushSnack("Privilège assigné au rôle", "success");
      await loadRolePrivileges(selectedRole);
    } catch (err: any) {
      console.error("assignPrivilegeToRole error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur assignation privilège", "error");
    } finally {
      setLoading(false);
    }
  };

  const removePrivilegeFromRole = async (privilegeId: number) => {
    if (!selectedRole) return;
    if (!confirm("Retirer ce privilège du rôle ?")) return;
    try {
      setLoading(true);
      await axios.delete(ROLE_ENDPOINTS.REMOVE_PRIVILEGE(selectedRole.id, privilegeId));
      pushSnack("Privilège retiré du rôle", "success");
      await loadRolePrivileges(selectedRole);
    } catch (err: any) {
      console.error("removePrivilegeFromRole error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur suppression privilège", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Assign role -> user ----------------------- */

  const assignRoleToUser = async () => {
    if (!assignUserId || !assignRoleId) return pushSnack("Sélectionner utilisateur et rôle", "info");
    try {
      setLoading(true);
      // POST api/admin/users/{userId}/role with body { userId, roleId }
      await axios.post(ADMIN_USERS_ENDPOINTS.ASSIGN_ROLE(Number(assignUserId)), { userId: assignUserId, roleId: assignRoleId });
      pushSnack("Rôle assigné à l'utilisateur", "success");
      // refresh users
      const rUsers = await axios.get(ADMIN_USERS_ENDPOINTS.GET_ALL);
      setUsers(rUsers.data || []);
      // reset selects
      setAssignUserId("");
      setAssignRoleId("");
    } catch (err: any) {
      console.error("assignRoleToUser error:", err);
      pushSnack(err?.response?.data?.message || err?.message || "Erreur assignation rôle utilisateur", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Render UI ----------------------- */

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Panneau d'administration — Rôles & Privilèges
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">Header dev X-Fake-UserId :</Typography>
          <TextField
            size="small"
            type="number"
            value={fakeUserId}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              setFakeUserId(v);
            }}
            sx={{ width: 100 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              setFakeHeader(fakeUserId);
              pushSnack("Header X-Fake-UserId mis à jour", "success");
            }}
          >
            Appliquer
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              setFakeHeader(undefined);
              pushSnack("Header X-Fake-UserId supprimé", "info");
            }}
          >
            Retirer header dev
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={fetchAll} disabled={loading}>
            {loading ? <CircularProgress size={18} /> : "Rafraîchir"}
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {/* Roles column */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Rôles</Typography>
              <Button startIcon={<AddIcon />} onClick={openCreateRoleDialog}>
                Nouveau
              </Button>
            </Stack>

            <List>
              {roles.map((r) => (
                <ListItem
                  key={r.id}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => openEditRoleDialog(r)} aria-label="edit role">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteRole(r.id)} aria-label="delete role">
                        <DeleteIcon />
                      </IconButton>
                      <Button onClick={() => loadRolePrivileges(r)} size="small">
                        Voir
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText primary={r.label} secondary={r.description} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Privileges column */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Privilèges</Typography>
              <Button startIcon={<AddIcon />} onClick={openCreatePrivDialog}>
                Nouveau
              </Button>
            </Stack>

            <List>
              {privileges.map((p) => (
                <ListItem
                  key={p.id}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => openEditPrivDialog(p)} aria-label="edit priv">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deletePrivilege(p.id)} aria-label="delete priv">
                        <DeleteIcon />
                      </IconButton>
                      <Button onClick={() => assignPrivilegeToRole(p.id)} disabled={!selectedRole} size="small">
                        Ajouter au rôle
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText primary={p.label} secondary={p.description} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Selected role details & assign role to user */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Détails rôle</Typography>

            {!selectedRole ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Sélectionnez un rôle pour voir ses privilèges.
              </Typography>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {selectedRole.label}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  {selectedRole.description}
                </Typography>

                <Typography variant="subtitle2">Privilèges assignés</Typography>
                {selectedRolePrivileges.length === 0 ? (
                  <Typography variant="body2">Aucun privilège.</Typography>
                ) : (
                  <List dense>
                    {selectedRolePrivileges.map((rp) => (
                      <ListItem
                        key={rp.id}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => removePrivilegeFromRole(rp.id)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={rp.label} secondary={rp.description} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}

            <Box mt={2}>
              <Typography variant="subtitle2">Assigner rôle à un utilisateur</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Select
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value as number)}
                  displayEmpty
                  size="small"
                  sx={{ minWidth: 140 }}
                >
                  <MenuItem value="">Utilisateur</MenuItem>
                  {users.length > 0
                    ? users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} ({u.roleLabel ?? "—"})
                        </MenuItem>
                      ))
                    : null}
                </Select>

                <Select
                  value={assignRoleId}
                  onChange={(e) => setAssignRoleId(e.target.value as number)}
                  displayEmpty
                  size="small"
                  sx={{ minWidth: 140 }}
                >
                  <MenuItem value="">Rôle</MenuItem>
                  {roles.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>

                <Button variant="contained" onClick={assignRoleToUser}>
                  Assigner
                </Button>
              </Stack>
            </Box>

            <Box mt={3}>
              <Typography variant="subtitle2">Liste des utilisateurs</Typography>
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rôle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.roleLabel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Role dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRole?.id === 0 ? "Créer un rôle" : "Modifier le rôle"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Label"
            fullWidth
            margin="dense"
            value={editingRole?.label ?? ""}
            onChange={(e) => setEditingRole((r) => (r ? { ...r, label: e.target.value } : r))}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={editingRole?.description ?? ""}
            onChange={(e) => setEditingRole((r) => (r ? { ...r, description: e.target.value } : r))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={saveRole}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Priv dialog */}
      <Dialog open={openPrivDialog} onClose={() => setOpenPrivDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPriv?.id === 0 ? "Créer privilège" : "Modifier privilège"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Label"
            fullWidth
            margin="dense"
            value={editingPriv?.label ?? ""}
            onChange={(e) => setEditingPriv((p) => (p ? { ...p, label: e.target.value } : p))}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={editingPriv?.description ?? ""}
            onChange={(e) => setEditingPriv((p) => (p ? { ...p, description: e.target.value } : p))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrivDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={savePrivilege}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: "100%" }} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
