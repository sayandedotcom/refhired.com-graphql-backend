"use client";

import { useState } from "react";

import { APPLY_REFERRAL_POST } from "@/graphql/posts/mutations/apply-referral-post";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@referrer/lib/utils/cn";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@referrer/ui";

import { applyValidator } from "@/lib/validators";

import { DynamicIcons } from "../icons/dynamic-icons";
import { sonerToast } from "./soner-toast";

export function ApplyDialog({
  myObject,
  postID,
  stars,
  totalApplied,
  acceptLimit,
  expired,
}: {
  myObject?: any;
  postID?: any;
  stars?: any;
  totalApplied?: any;
  acceptLimit?: any;
  expired?: any;
}) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [applyPost, { data, error }] = useMutation(APPLY_REFERRAL_POST);

  const form = useForm<z.infer<typeof applyValidator>>({
    resolver: zodResolver(applyValidator),
    defaultValues: {
      message: "",
    },
  });

  // const myObject = {
  //   message: true,
  //   pdfs: ["resume", "coverLetter"],
  //   links: ["github", "linkedin"],
  // };

  async function onSubmit(values: z.infer<typeof applyValidator>) {
    console.log(values);

    if (error?.message) {
      sonerToast({
        severity: "error",
        title: "Error Has occured !!",
        message: error.message,
      });
    }

    try {
      applyPost({
        variables: {
          payload: {
            applyInfo: values as never,
            postId: postID,
            userId: session.user.id,
          },
        },
      });

      if (data?.applyPost.success) {
        setOpen(!open);
        sonerToast({
          severity: "success",
          title: "Congratulations !!",
          message: data.applyPost.message,
        });
      }
      if (data?.applyPost.success === false) {
        sonerToast({
          severity: "error",
          title: "Error !!",
          message: data.applyPost.message,
        });
      }
    } catch (error) {
      sonerToast({
        severity: "error",
        title: "Error Occured !",
        message: error.message,
      });
    }

    // toastMessage({
    //   type: "success",
    //   title: "Applied Successfully !",
    //   message: "You have successfully applied for this job.",
    // });
  }

  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  //   //  keyName:
  // });

  // !form.formState.isSubmitSuccessful;

  const full = totalApplied === acceptLimit;
  const fileRef = form.register("pdfs");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id="post-apply"
          onClick={() => setOpen(!open)}
          // disabled={applied}
          disabled={full || expired}
          // isLoading={loadingValue === "apply"}
          // iconBefore={applied && <AiOutlineCheckCircle className="mr-2 h-4 w-4 text-green-400" />}
          // onClick={apply}
          className="h-9 w-3/12 rounded-full text-sm">
          {(full && "Full") || (expired && "Expired") || "Apply"} (⭐ {stars} ) {totalApplied} / {acceptLimit}
          {/* {applied ? "Applied !" : `Apply (⭐ ${stars})`} */}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-foreground w-11/12 md:w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-3xl">Best of Luck ! 🤞</DialogTitle>
          <DialogDescription className="text-base">
            Provide the necessary information for this referral.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative flex flex-col space-y-2">
            {/* Message */}
            {myObject.hasOwnProperty("message") && myObject.message === true && (
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Write a short message to the referrer</FormLabel>
                    <FormControl>
                      <Textarea
                        id="message"
                        name="message"
                        rows={7}
                        cols={70}
                        className="text-base"
                        placeholder="Write a short message to the referrer here. . . . . ."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* PDF */}
            {myObject.hasOwnProperty("pdfs") &&
              myObject.pdfs.map((name, index) => (
                <FormField
                  control={form.control}
                  name={`pdfs.${index}.${name}`}
                  key={index}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center gap-5">
                      <FormLabel className="text-center text-sm">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          name={name}
                          type="file"
                          accept=".pdf"
                          className="ml-auto w-8/12 cursor-pointer"
                          // {...fileRef}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            {/* Links */}
            <div className="mt-2">
              {myObject.hasOwnProperty("links") &&
                myObject.links.map((name, index) => (
                  <FormField
                    control={form.control}
                    key={index}
                    name={`links.${index}.${name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>Links</FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          Add links to your website, blog, or social media profiles.
                        </FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <DynamicIcons iconName={name} className="h-7 w-7" />
                            <Input
                              {...field}
                              placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                              type="url"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            <Button
              // disabled={!form.formState.isValid}
              className="w-5/12 self-center rounded-full"
              type="submit">
              Apply !
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

{
  /* Message */
}
{
  /* <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Write a short message to the referrer</FormLabel>
                  <FormControl>
                    <Textarea
                      id="message"
                      name="message"
                      rows={7}
                      cols={70}
                      className="text-base"
                      placeholder="Write a short message to the referrer here. . . . . ."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */
}
{
  /* Resume */
}
{
  /* <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center gap-5">
                  <FormLabel className="text-center text-sm">Resume 📄</FormLabel>
                  <FormControl>
                    <Input
                      id="resume"
                      name="resume"
                      accept=".pdf"
                      type="file"
                      className="ml-auto w-8/12 cursor-pointer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */
}
{
  /* Cover Letter */
}
{
  /* <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center gap-3">
                  <FormLabel className="text-center text-sm">Cover Letter 📝</FormLabel>
                  <FormControl>
                    <Input
                      id="coverLetter"
                      name="coverLetter"
                      accept=".pdf"
                      type="file"
                      className="ml-auto w-8/12 cursor-pointer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */
}
{
  /* Links */
}
{
  /* <div className="mt-2">
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`urls.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>URLs</FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add links to your website, blog, or social media profiles.
                      </FormDescription>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Icons.gitHub className="h-7 w-7" />
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="my-2"
                onClick={() => append({ value: "" })}>
                Add URL 🔗
              </Button>
            </div> */
}
