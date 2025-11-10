"use client";

import { updateCompanyAction } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
    simpleCompanySchema,
    type SimpleCompanyFormData,
} from "@/lib/validations/company";
import type { Company } from "@/types/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (company: Company) => void;
}

// Helper function to convert Company fields to simple strings
function getStringValue(value: string | object | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  
  // For complex types, extract the most relevant string
  if ("primary" in value) return value.primary as string;
  if ("name" in value) return value.name as string;
  if ("city" in value) return value.city as string || "";
  
  return "";
}

export function EditCompanyDialog({
  company,
  open,
  onOpenChange,
  onSuccess,
}: EditCompanyDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SimpleCompanyFormData>({
    resolver: zodResolver(simpleCompanySchema),
    defaultValues: {
      name: company.name,
      industry: getStringValue(company.industry),
      description: company.description ?? "",
      founded: company.founded ?? undefined,
      location: getStringValue(company.location),
      employee_count: company.employee_count ?? undefined,
      website: company.website ?? "",
      logo_url: company.logo_url ?? "",
      ceo: getStringValue(company.ceo),
    },
  });

  async function onSubmit(data: SimpleCompanyFormData) {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = await updateCompanyAction(company.id, null, formData);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        form.reset();
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }
      } else {
        toast.error(result.message);
        
        // Show field-specific errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof SimpleCompanyFormData, {
              message: messages.join(", "),
            });
          });
        }
      }
    });
  }

  // Reset form when company changes
  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        industry: getStringValue(company.industry),
        description: company.description ?? "",
        founded: company.founded ?? undefined,
        location: getStringValue(company.location),
        employee_count: company.employee_count ?? undefined,
        website: company.website ?? "",
        logo_url: company.logo_url ?? "",
        ceo: getStringValue(company.ceo),
      });
    }
  }, [company, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the company information below. Fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Technology, Healthcare"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the company"
                      disabled={isPending}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="YYYY"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value, 10) : undefined);
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City, Country"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employee_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employees</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of employees"
                        disabled={isPending}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value, 10) : undefined);
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ceo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEO</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CEO Name"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
