
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';
import { IdeaFormData } from '@/types/analysis';

const formSchema = z.object({
  problem: z.string().min(10, 'Please provide more detail about the problem'),
  targetMarket: z.string().min(10, 'Please describe your target market in more detail'),
  uniqueValue: z.string().min(10, 'Please explain what makes your idea unique'),
  customerAcquisition: z.string().min(10, 'Please describe your customer acquisition strategy'),
});

interface IdeaFormProps {
  onSubmit: (data: IdeaFormData) => void;
  isLoading: boolean;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: '',
      targetMarket: '',
      uniqueValue: '',
      customerAcquisition: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What problem does your idea solve?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the specific problem your idea addresses..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetMarket"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Who is your target market?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Define your ideal customer profile..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uniqueValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What makes your idea unique?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain your unique value proposition..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerAcquisition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How will you reach your customers?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your customer acquisition strategy..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-brand-600 hover:bg-brand-700 gap-2"
          >
            Validate My Idea
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default IdeaForm;
