"use client";

import { createCompanyAction } from "@/actions/companies";
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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (company: Company) => void;
}

export function CreateCompanyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCompanyDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isLocationAdvanced, setIsLocationAdvanced] = useState(false);
  const [isIndustryAdvanced, setIsIndustryAdvanced] = useState(false);
  const [isCeoAdvanced, setIsCeoAdvanced] = useState(false);

  const form = useForm<RichCompanyFormData>({
    resolver: zodResolver(richCompanyFormSchema),
    defaultValues: {
      name: "",
      industry_simple: "",
      description: "",
      founded: undefined,
      location_simple: "",
      employee_count: undefined,
      website: "",
      logo_url: "",
      ceo_simple: "",
      // Advanced location fields
      location_address: "",
      location_city: "",
      location_zip_code: "",
      location_country: "",
      // Advanced industry fields
      industry_primary: "",
      industry_sectors: "",
      // Advanced CEO fields
      ceo_name: "",
      ceo_since: undefined,
      ceo_bio: "",
    },
  });

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
      const result = await createCompanyAction(null, formData);

      if (result.success) {
        toast.success(result.message);
        // Small delay to show the success state
        await new Promise((resolve) => setTimeout(resolve, 300));
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
            form.setError(field as keyof RichCompanyFormData, {
              message: messages.join(", "),
            });
          });
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
          <DialogDescription>
            Add a new company to your database. Fields marked with * are
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
                Create Company
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
