import { Metadata } from "next";
import dynamic from "next/dynamic";

import { GET_ALL_REQUESTS } from "@/graphql/posts/queries/get-all-requests";
import { getAuthSession } from "@refhiredcom/features/auth/lib/auth";
import { unstable_setRequestLocale } from "next-intl/server";

import { getClient } from "@/lib/apollo-client/client";

import Loading from "../../loading";

export const metadata: Metadata = {
  title: "Requests",
  description: "Get job referrals to the top best companies of the world",
};

const DynamicRequestDataTable = dynamic(() => import("@/components/requests/requests-data-table"), {
  loading: () => <Loading />,
});

const Requests = async ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);

  const session = await getAuthSession();

  const client = getClient();

  const { data, loading, errors } = await client.query({
    query: GET_ALL_REQUESTS,
    variables: {
      getAllRequestsId: session.user.id,
    },
  });

  const transformArray = (originalArray) => {
    const transformedArray = [];

    originalArray.forEach((obj) => {
      obj.appliedInfo.forEach((applyInfo) => {
        const transformedObj = {
          id: obj.id,
          received: applyInfo.appliedAt,
          // status: "Read",
          post: obj.description.slice(0, 17) + "...",
          email: applyInfo.user.email,
          amount: obj.stars * 10,
          message: applyInfo.applyInfo.message,
          pdfs: applyInfo.applyInfo.pdfs,
          links: applyInfo.applyInfo.links,
        };
        transformedArray.push(transformedObj);
      });
    });

    return transformedArray;
  };

  const formattedArray = transformArray(data.getAllRequests.Posts);

  return <DynamicRequestDataTable data={formattedArray || []} />;
};

export default Requests;
