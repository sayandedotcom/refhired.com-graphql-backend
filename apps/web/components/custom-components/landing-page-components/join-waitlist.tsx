"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PartyPopper } from "lucide-react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import * as z from "zod";

import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from "@referrer/ui";

import { sonerToast } from "@/components/ui";

import { WordRotateComponentOne } from "./word-rotate-component-one";

// const placeholders = ["Enter your Email Address..", "john.doe@example.com", "Get added to the waitlist"];

const joinWaitlistSchema = z.object({
  email: z
    .string()
    .nonempty("Please enter an email address 😐")
    .email({ message: "Invalid email address ! 🤔" }),
});

export function JoinWaitlist() {
  const [waitlisted, setWaitlisted] = useLocalStorage("waitlist", "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof joinWaitlistSchema>>({
    resolver: zodResolver(joinWaitlistSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof joinWaitlistSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email: values.email }),
      });
      const data = await response.json();
      if (data.status === 409) {
        setError(data?.message);
      }
      if (data.status === 200) {
        setError("");
        setWaitlisted(values.email);
        sonerToast({
          severity: "success",
          title: "Sucess !",
          message: data.message,
        });
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  // };
  // const onSubmitt = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("submitted");
  // };

  return (
    <>
      {waitlisted ? (
        <>
          <Fireworks autorun={{ speed: 3, duration: 3000 }} />
          <p className="bg-foreground relative z-10 text-center font-sans font-bold text-transparent dark:bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text">
            You've successfully joined our waitlist using the email address {waitlisted}
          </p>
        </>
      ) : (
        //  h-[20rem]
        <div className="relative flex w-full flex-col items-center justify-center rounded-md antialiased">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
            <h1 className="bg-foreground relative z-10 bg-clip-text text-center text-lg font-bold text-transparent dark:bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-600 md:text-7xl">
              <WordRotateComponentOne />
            </h1>
            {/* <WordRotateComponentOne /> */}
            <p className="font-heading relative mx-auto my-2 max-w-5xl text-center text-base font-medium">
              Join our waitlist and be the first to know when we launch our product! We'll notify you via
              email as soon as it's available. Plus, we may offer special access to some of our waitlisted
              users!
            </p>
            {/* <div className="flex w-full flex-col items-center justify-center">
             <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmitt}
              />
            </div> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-3 flex items-start justify-center gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>
                        Email Address <Required />
                      </FormLabel> */}
                      <FormControl>
                        <Input
                          placeholder="Enter your email address......"
                          type="text"
                          {...field}
                          className="md:w-96"
                        />
                        {/* <div className="flex w-full flex-col items-center justify-center">
                          <PlaceholdersAndVanishInput
                            placeholders={placeholders}
                            onChange={handleChange}
                            onSubmit={onSubmitt}
                            {...field}
                          />
                        </div> */}
                      </FormControl>
                      <FormMessage className="justify-center text-[#ff3535bb]">{error}</FormMessage>
                      {/* <FormDescription> Enter your email address !</FormDescription> */}
                    </FormItem>
                  )}
                />
                <Button type="submit" isLoading={loading} className="flex items-center justify-center">
                  {loading ? "Please Wait" : "Join Waitlist"}{" "}
                  {loading ? <></> : <PartyPopper className="ml-4" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
