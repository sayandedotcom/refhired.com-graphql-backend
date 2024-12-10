import { Metadata } from "next";

import { GET_ALL_POSTS } from "@/graphql/posts/queries/get-all-posts";
import { fromNow, timeLeft } from "@refhiredcom/utils";
import { unstable_setRequestLocale } from "next-intl/server";

import { PostCard } from "@/components/custom-components";
import { MultipleButtons } from "@/components/custom-components/post-card/post-buttons";
import Navigate from "@/components/navigate";
import { ApplyDialog } from "@/components/ui";

import { getClient } from "@/lib/apollo-client/client";

export const metadata: Metadata = {
  title: "Home",
  description: "Get job referrals to the top best companies of the world",
};

const Home = async ({ params: { locale } }) => {
  unstable_setRequestLocale(locale);
  // const { user } = await getAuthSession();
  const client = getClient();
  const { data, loading, errors } = await client.query({
    query: GET_ALL_POSTS,
    // pollInterval
  });

  // if (errors?.[0].message) {
  //   sonerToast({
  //     severity: "error",
  //     title: "Error has occured !",
  //     message: errors[0].message,
  //   });
  // }

  const expired = (date: any): boolean => {
    return timeLeft(date);
  };

  return (
    <>
      {data?.getAllPosts.map((data) => (
        <PostCard key={data.id}>
          <PostCard.Image src={data.user?.image ?? "/images/avatar/avatar.png"} />
          <PostCard.Content>
            <PostCard.Header
              name={data.user?.name}
              userName={`@${data.user?.userName}`}
              time={fromNow(data.createdAt)}
              timeLeft={fromNow(data.expiresAt)}
            />
            <Navigate userName={data.user.userName} postId={data.id}>
              <PostCard.Description>{data.description}</PostCard.Description>
            </Navigate>
            <PostCard.Tags
              allTags={false}
              location={data.jobLocation}
              experience={data.jobExperience}
              jobType={data.jobType}
              role={data.jobRole}
              salary={data.jobCompensation}
              // skills={data.tags}
            />
            <PostCard.Footer>
              <MultipleButtons link={`${data.user.userName}/${data.id}`} title={data.description} />
              <ApplyDialog
                myObject={data.accept}
                postID={data.id}
                stars={data.stars}
                totalApplied={data.totalApplied}
                acceptLimit={data.acceptLimit}
                expired={expired(data.expiresAt)}
              />
            </PostCard.Footer>
          </PostCard.Content>
        </PostCard>
      ))}
    </>
  );
};

export default Home;
