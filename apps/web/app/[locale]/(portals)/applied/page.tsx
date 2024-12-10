import { Metadata } from "next";
import dynamic from "next/dynamic";

import { unstable_setRequestLocale } from "next-intl/server";

import Loading from "../../loading";

export const metadata: Metadata = {
  title: "Applied",
  description: "Get job referrals to the top best companies of the world",
};

const DynamicAppliedDataTable = dynamic(() => import("@/components/applied/applied-data-table"), {
  loading: () => <Loading />,
});

const Applied = ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);
  return <DynamicAppliedDataTable />;
};

export default Applied;
