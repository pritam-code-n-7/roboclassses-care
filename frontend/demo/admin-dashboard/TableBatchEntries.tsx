import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditButton } from "./EditButton";

import useSWR from "swr";
import axios from "axios";
import { batchType } from "@/types/Types";
import Link from "next/link";
import { NewBatchEntryUrl } from "@/constants";
import { toast } from "@/hooks/use-toast";



const weekdays = ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"]

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function TableBatchEntries() {
  const { data, isLoading, isValidating, error, mutate } = useSWR<batchType[]>(NewBatchEntryUrl,fetcher);

  // Handle delete a batch
  const handleDelete = async(id:string)=>{
    try {
      const res = await axios.delete(`${NewBatchEntryUrl}/${id}`)
      console.log(res.data);

      mutate((data)=>data?.filter((batch)=>batch._id !== id))

      const {message} = res.data;
      toast({title: "Success✅", description: message,variant: "default",});
          } catch (error) {
      console.log(error);  
      toast({title:"Failed", description:"Unable to delete batch entry", variant:"destructive"})
    }
  }
 // Handle edge cases
 if (isLoading) return <div>Loading...</div>;
 if (error) return <div>Failed to load</div>;
 if (isValidating) return <div>Refreshing...</div>;
 if (data?.length === 0) return <div>Empty list for Batches</div>;

  return (
    <Table className="border border-black">
      <TableCaption>A list of batches</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Teacher Name</TableHead>
          <TableHead>Batch Name</TableHead>
          <TableHead>Times</TableHead>
          <TableHead>Edit</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((batch: batchType) => (
          <TableRow key={batch._id}>
            <TableCell className="font-medium">{batch.teacher}</TableCell>
            <TableCell>{batch.batch}</TableCell>
            <TableCell className="text-right">
              <TableRow>
                <TableCell>
                  {weekdays.map((day)=>(day)).join(' | ')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {batch.time.map((value) =>!isNaN(parseInt(value[0], 10)) ? value : "N/A").join(" | ")}
                </TableCell>
              </TableRow>
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/newBatchEntry/edit/${batch._id}`}>
              <EditButton name="Edit" type="button" />
              </Link>
            </TableCell>
            <TableCell className="text-right">
              <EditButton name="Delete" type="button" varient="destructive" onClick={()=>handleDelete(batch._id)}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total Rows</TableCell>
          <TableCell className="text-right">{data?.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
