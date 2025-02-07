/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { NewBatchEntryUrl } from "@/constants";

import axios from "axios";
import Cookies from 'js-cookie'
import { useParams } from "next/navigation";

const weekdays = [
  {
    id: "sun",
    label: "Sunday",
  },
  {
    id: "mon",
    label: "Monday",
  },
  {
    id: "tue",
    label: "Tuesday",
  },
  {
    id: "wed",
    label: "Wednesday",
  },
  {
    id: "thu",
    label: "Thursday",
  },
  {
    id: "fri",
    label: "Friday",
  },
  {
    id: "sat",
    label: "Saturday",
  },
];

const times = [
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
  },
  {
    id: new Date().toLocaleTimeString().substring(12, 18),
  },
  {
    id: new Date().toLocaleTimeString().substring(15, 20),
  },
  {
    id: new Date().toLocaleTimeString().substring(10, 23),
  },
  {
    id: new Date().toLocaleTimeString().substring(16, 21),
  },
  {
    id: new Date().toLocaleTimeString().substring(17, 24),
  },
];

const FormSchema = z.object({

  batch: z
    .string()
    .min(1, { message: "Batch number must contain atleast 1 character" }),

  teacher: z
    .string()
    .min(2, { message: "Teacher name must contain atleast 2 character." }),

  time: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one time.",
  }),
});

export function EditBatchForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teacher: "",
      batch: "",
      time: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    },
  });

  const {id} = useParams();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await axios.put(`${NewBatchEntryUrl}/${id}`,data, {headers:{ Authorization:Cookies.get("token") }});
      console.log(res.data);
      form.reset();
      const {message} = res.data;
      toast({
        title: "Success✅",
        description: message,
        variant:"default"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed ",
        description: "Unable to update batch!",
        variant:"destructive"
      });
    }
   
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Table>
          <TableCaption>A list of weekdays with time slot</TableCaption>
          <TableHeader>
            <TableRow>
              {weekdays.map((item, index) => (
                <TableHead className="w-[100px]" key={index}>
                  {item.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {times.map((item, index) => (
                <TableCell className="font-medium" key={index}>
                  <FormField
                    control={form.control}
                    name={`time.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="time" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>

        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Batch Number</FormLabel>

              <FormControl>
                <Input
                  placeholder="e.g. Python B12 L1"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Teacher Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="e.g. Monty"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
