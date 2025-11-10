import { CreateCompanyDialog } from "@/components/dialogs/create-company-dialog";
import { DeleteCompanyDialog } from "@/components/dialogs/delete-company-dialog";
import { EditCompanyDialog } from "@/components/dialogs/edit-company-dialog";
import type { Company } from "@/types/company";

interface CompaniesDialogsProps {
  // Delete dialog
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  companyToDelete: Company | null;
  onDeleteConfirm: (company: Company) => Promise<void>;

  // Edit dialog
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  companyToEdit: Company | null;
  onEditSuccess: (company: Company) => void;

  // Create dialog
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  onCreateSuccess: (company: Company) => void;
}

export function CompaniesDialogs({
  deleteDialogOpen,
  setDeleteDialogOpen,
  companyToDelete,
  onDeleteConfirm,
  editDialogOpen,
  setEditDialogOpen,
  companyToEdit,
  onEditSuccess,
  createDialogOpen,
  setCreateDialogOpen,
  onCreateSuccess,
}: CompaniesDialogsProps) {
  return (
    <>
      <DeleteCompanyDialog
        company={companyToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDeleteConfirm}
      />

      {companyToEdit && (
        <EditCompanyDialog
          company={companyToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={onEditSuccess}
        />
      )}

      <CreateCompanyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={onCreateSuccess}
      />
    </>
  );
}
