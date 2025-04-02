import { UseFormReturn } from "react-hook-form";
import { TCreateUserRequest, TUpdateUserRequest } from "@/api/users/schema";
import { Button } from "@/components/ui/button";
import {
  createFieldPath,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type UserFormKey = keyof TCreateUserRequest & keyof TUpdateUserRequest;

type UserFormProps<T extends TCreateUserRequest | TUpdateUserRequest> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  isSubmitting?: boolean;
  isUpdateMode?: boolean;
};

export default function UserForm<T extends TCreateUserRequest | TUpdateUserRequest>({
  form,
  onSubmit,
  isSubmitting,
  isUpdateMode = false,
}: UserFormProps<T>) {
  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
      >
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name={createFieldPath<T, UserFormKey>("email")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={createFieldPath<T, UserFormKey>("name")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Full Name" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={createFieldPath<T, UserFormKey>("phone_number")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Phone Number" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={createFieldPath<T, UserFormKey>("password")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full items-center justify-end gap-2 border-t pt-3">
          <Button
            className="w-auto"
            disabled={isSubmitting ?? form.formState.isSubmitting}
            onClick={() => form.reset()}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
          <Button
            className="w-auto"
            disabled={isSubmitting ?? form.formState.isSubmitting}
            type="submit"
          >
            {isUpdateMode ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
