import { deleteCompanyAction } from "@/actions/companies";
import type { Company } from "@/types/company";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

export function useCompanyActions(companies: Company[]) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  const [, startActionTransition] = useTransition();

  const [optimisticCompanies, updateOptimistic] = useOptimistic(
    companies,
    (
      state,
      action:
        | { type: "delete"; id: string }
        | { type: "update"; company: Company }
        | { type: "create"; company: Company }
    ) => {
      if (action.type === "delete") {
        return state.filter((c) => c.id !== action.id);
      } else if (action.type === "update") {
        return state.map((c) =>
          c.id === action.company.id ? action.company : c
        );
      } else {
        return [action.company, ...state];
      }
    }
  );

  const handleEdit = (company: Company) => {
    setCompanyToEdit(company);
    setEditDialogOpen(true);
  };

  const handleDelete = (company: Company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (company: Company) => {
    startActionTransition(async () => {
      updateOptimistic({ type: "delete", id: company.id });

      const result = await deleteCompanyAction(company.id);

      if (result.success) {
        toast.success(result.message ?? "Company deleted successfully!");
      } else {
        toast.error(result.message ?? "Failed to delete company.");
      }
    });
  };

  const handleEditSuccess = (updatedCompany: Company) => {
    startActionTransition(() => {
      updateOptimistic({ type: "update", company: updatedCompany });
    });
  };

  const handleCreateSuccess = (newCompany: Company) => {
    startActionTransition(() => {
      updateOptimistic({ type: "create", company: newCompany });
    });
  };

  return {
    // Optimistic state
    optimisticCompanies,

    // Dialog state
    createDialogOpen,
    setCreateDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    companyToDelete,
    editDialogOpen,
    setEditDialogOpen,
    companyToEdit,

    // Actions
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
    handleEditSuccess,
    handleCreateSuccess,
  };
}
