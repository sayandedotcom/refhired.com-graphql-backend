import { Metadata } from "next";

import { GET_POSTS_BY_SLUG } from "@/graphql/posts/queries/get-post-by-slug";
import { fromNow } from "@refhiredcom/utils";

import { PostCard } from "@/components/custom-components";
import { MultipleButtons } from "@/components/custom-components/post-card/post-buttons";
import { ApplyDialog } from "@/components/ui";

import { getClient } from "@/lib/apollo-client/client";

interface PostProps {
  params: {
    postId: string;
  };
}

// export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
//   const post = await getPostBySlug(params.postId);
//   if (!post)
//     return {
//       title: "Not Found",
//       description: "The page is not found",
//     };

//   return {
//     title: post.title,
//     description: post.description,
//     alternates: {
//       canonical: `/post/${post.id}`, // ! Canonical url for the post
//       languages: {
//         "en-CA": `en-CA/post/${post.id}`, // ! English (Canada) language website
//       },
//     },
//   };
// }

export const metadata: Metadata = {
  title: "Post",
  description: "Get job referrals to the top best companies of the world",
};

export default async function Post({ params }: PostProps) {
  const client = getClient();
  const { data, loading, error, errors } = await client.query({
    query: GET_POSTS_BY_SLUG,
    variables: { getPostBySlugId: atob(params.postId) },
  });

  // console.log(data.getPostBySlug.tag);

  return (
    <>
      <PostCard key={data.getPostBySlug.id}>
        <PostCard.Image src={data.getPostBySlug?.user?.image ?? "/images/avatar/avatar.png"} />
        <PostCard.Content>
          <PostCard.Header
            name={data.getPostBySlug.user?.name}
            userName={`@${data.getPostBySlug.user?.userName}`}
            time={fromNow(data.getPostBySlug.createdAt)}
            timeLeft={fromNow(data.getPostBySlug.expiresAt)}
          />
          <PostCard.Description>{data.getPostBySlug.description}</PostCard.Description>
          <PostCard.Tags
            allTags={true}
            location={data.getPostBySlug.jobLocation}
            experience={data.getPostBySlug.jobExperience}
            jobType={data.getPostBySlug.jobType}
            role={data.getPostBySlug.jobRole}
            salary={data.getPostBySlug.jobCompensation}
            skills={data.getPostBySlug.tags}
          />
          <PostCard.Footer>
            <MultipleButtons />
            <ApplyDialog
              myObject={data.getPostBySlug.accept}
              postID={data.getPostBySlug.id}
              stars={data.getPostBySlug.stars}
              totalApplied={data.getPostBySlug.totalApplied}
              acceptLimit={data.getPostBySlug.acceptLimit}
            />
          </PostCard.Footer>
        </PostCard.Content>
      </PostCard>
    </>
  );
}
