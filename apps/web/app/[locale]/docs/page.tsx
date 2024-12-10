import { Metadata } from "next";

import { Example } from "@/graphql/queries/posts";
import { unstable_setRequestLocale } from "next-intl/server";

import { getClient } from "@/lib/apollo-client/client";

export const metadata: Metadata = {
  title: "Docs",
  description: "Docs of Refhired.com",
};

const Docs = async ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);
  const client = getClient();
  const { data, loading, error, errors } = await client.query({
    query: Example,
  });
  // console.log("error==================================", error?.message);
  // console.log("errors=================================", errors);

  return (
    <section className="py-14">
      {errors ? <h1>{errors[0]?.message}</h1> : <h2>{data?.hello}</h2>}
      <div className="relative mx-auto max-w-xl sm:text-center">
        <h1 className="font-heading font-semibold">Our Docs</h1>
        <div className="mt-3 max-w-xl">
          <h5 className="font-heading">Will be Updated soon</h5>
        </div>
      </div>
    </section>
  );
};

export default Docs;
