import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ProjectTableRow from "./ProjectTableRow";

export default function ProjectTable({ projects, onEdit, onDelete }: any) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: "#1b365f" }}>ID</TableCell>
          <TableCell>Nom</TableCell>
          <TableCell>Date début</TableCell>
          <TableCell>Date fin</TableCell>
          <TableCell>Statut</TableCell>
          <TableCell>Progression</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {projects.map((p: any) => (
          <ProjectTableRow project={p} key={p.id} onEdit={onEdit} onDelete={onDelete} onViewTasks={() => {}} />
        ))}
      </TableBody>
    </Table>
  );
}
