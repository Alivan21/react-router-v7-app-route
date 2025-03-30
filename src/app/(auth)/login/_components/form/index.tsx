import { UseFormReturn } from "react-hook-form";
import { TLoginRequest } from "@/api/auth/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  form: UseFormReturn<TLoginRequest>;
  onSubmit: (data: TLoginRequest) => Promise<void>;
  isSubmitting?: boolean;
};

export default function LoginForm({ form, onSubmit, isSubmitting }: LoginFormProps) {
  return (
    <Form {...form}>
      <form
        className="w-full space-y-4"
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
      >
        <FormField
          control={form.control}
          name="email"
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
          name="password"
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
        <Button
          className="mt-4 w-full"
          disabled={isSubmitting ?? form.formState.isSubmitting}
          type="submit"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
