/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  richCompanyFormSchema,
  type RichCompanyFormData,
} from "@/lib/validations/company-rich";
import type { Company } from "@/types/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (company: Company) => void;
}

// Helper to check if value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function EditCompanyDialog({
  company,
  open,
  onOpenChange,
  onSuccess,
}: EditCompanyDialogProps) {
  const [isPending, startTransition] = useTransition();
  
  // Auto-detect if fields are already in object format
  const [isLocationAdvanced, setIsLocationAdvanced] = useState(
    isObject(company.location)
  );
  const [isIndustryAdvanced, setIsIndustryAdvanced] = useState(
    isObject(company.industry)
  );
  const [isCeoAdvanced, setIsCeoAdvanced] = useState(
    isObject(company.ceo)
  );

  const form = useForm<RichCompanyFormData>({
    resolver: zodResolver(richCompanyFormSchema),
    defaultValues: getDefaultValues(company),
  });

  function getDefaultValues(company: Company): RichCompanyFormData {
    // Location
    const locationObj = isObject(company.location) ? company.location : null;
    const locationStr = typeof company.location === "string" ? company.location : "";

    // Industry
    const industryObj = isObject(company.industry) ? company.industry : null;
    const industryStr = typeof company.industry === "string" ? company.industry : "";

    // CEO
    const ceoObj = isObject(company.ceo) ? company.ceo : null;
    const ceoStr = typeof company.ceo === "string" ? company.ceo : "";

    return {
      name: company.name,
      description: company.description ?? "",
      founded: company.founded ?? undefined,
      employee_count: company.employee_count ?? undefined,
      website: company.website ?? "",
      logo_url: company.logo_url ?? "",
      
      // Simple fields
      location_simple: locationStr,
      industry_simple: industryStr,
      ceo_simple: ceoStr,
      
      // Advanced location fields
      location_address: (locationObj?.address!) ?? "",
      location_city: (locationObj?.city!) ?? "",
      location_zip_code: (locationObj?.zip_code!) ?? "",
      location_country: (locationObj?.country!) ?? "",
      
      // Advanced industry fields
      industry_primary: (industryObj?.primary!) ?? "",
      industry_sectors: Array.isArray(industryObj?.sectors) 
        ? (industryObj.sectors).join(", ") 
        : "",
      
      // Advanced CEO fields
      ceo_name: (ceoObj?.name!) ?? "",
      ceo_since: (ceoObj?.since!) ?? undefined,
      ceo_bio: (ceoObj?.bio!) ?? "",
    };
  }

  async function onSubmit(data: RichCompanyFormData) {
    const formData = new FormData();

    // Basic fields
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.logo_url) formData.append("logo_url", data.logo_url);
    if (data.website) formData.append("website", data.website);
    if (data.employee_count) formData.append("employee_count", String(data.employee_count));
    if (data.founded) formData.append("founded", String(data.founded));

    // Location handling
    if (isLocationAdvanced) {
      const location = {
        address: data.location_address ?? undefined,
        city: data.location_city ?? undefined,
        zip_code: data.location_zip_code ?? undefined,
        country: data.location_country ?? undefined,
      };
      formData.append("location", JSON.stringify(location));
    } else if (data.location_simple) {
      formData.append("location", data.location_simple);
    }

    // Industry handling
    if (isIndustryAdvanced) {
      const industry = {
        primary: data.industry_primary ?? "",
        sectors: data.industry_sectors ? data.industry_sectors.split(",").map(s => s.trim()) : undefined,
      };
      formData.append("industry", JSON.stringify(industry));
    } else if (data.industry_simple) {
      formData.append("industry", data.industry_simple);
    }

    // CEO handling
    if (isCeoAdvanced) {
      const ceo = {
        name: data.ceo_name ?? "",
        since: data.ceo_since ?? undefined,
        bio: data.ceo_bio ?? undefined,
      };
      formData.append("ceo", JSON.stringify(ceo));
    } else if (data.ceo_simple) {
      formData.append("ceo", data.ceo_simple);
    }

    startTransition(async () => {
      const result = await updateCompanyAction(company.id, null, formData);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }
      } else {
        toast.error(result.message);

        // Show field-specific errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof RichCompanyFormData, {
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
      // Reset advanced mode states based on new company data
      setIsLocationAdvanced(isObject(company.location));
      setIsIndustryAdvanced(isObject(company.industry));
      setIsCeoAdvanced(isObject(company.ceo));
      
      form.reset(getDefaultValues(company));
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

            {/* Industry Section - Collapsible */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FormLabel>Industry</FormLabel>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Advanced
                  </span>
                  <Switch
                    checked={isIndustryAdvanced}
                    onCheckedChange={setIsIndustryAdvanced}
                    disabled={isPending}
                  />
                </div>
              </div>

              {!isIndustryAdvanced ? (
                <FormField
                  control={form.control}
                  name="industry_simple"
                  render={({ field }) => (
                    <FormItem>
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
              ) : (
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="industry_primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Industry</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Technology"
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
                    name="industry_sectors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sectors (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Software, Cloud Computing, AI"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter multiple sectors separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

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
            </div>

            {/* Location Section - Collapsible */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FormLabel>Location</FormLabel>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Advanced
                  </span>
                  <Switch
                    checked={isLocationAdvanced}
                    onCheckedChange={setIsLocationAdvanced}
                    disabled={isPending}
                  />
                </div>
              </div>

              {!isLocationAdvanced ? (
                <FormField
                  control={form.control}
                  name="location_simple"
                  render={({ field }) => (
                    <FormItem>
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
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="location_address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Street address"
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
                    name="location_city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
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
                    name="location_zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Zip/Postal code"
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
                    name="location_country"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Country"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
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
            </div>

            {/* CEO Section - Collapsible */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <FormLabel>CEO</FormLabel>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Advanced
                  </span>
                  <Switch
                    checked={isCeoAdvanced}
                    onCheckedChange={setIsCeoAdvanced}
                    disabled={isPending}
                  />
                </div>
              </div>

              {!isCeoAdvanced ? (
                <FormField
                  control={form.control}
                  name="ceo_simple"
                  render={({ field }) => (
                    <FormItem>
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
              ) : (
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="ceo_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="ceo_since"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEO Since</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="YYYY"
                            disabled={isPending}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? parseInt(value, 10) : undefined
                              );
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
                    name="ceo_bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief biography of the CEO"
                            disabled={isPending}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
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
