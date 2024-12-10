import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { GET_USER_PROFILE } from "@/graphql/users/posts";
import { getAuthSession } from "@refhiredcom/features/auth/lib/auth";
import { fromNow } from "@refhiredcom/utils";
import { Mail, MapPin } from "lucide-react";

import { Separator } from "@referrer/ui";

import { PostCard } from "@/components/custom-components";
import { MultipleButtons } from "@/components/custom-components/post-card/post-buttons";
import Navigate from "@/components/navigate";
import { ApplyDialog } from "@/components/ui";

import { getClient } from "@/lib/apollo-client/client";

import { cn } from "@/utils";

export const metadata: Metadata = {
  title: "Profile",
  description: "Get job referrals to the top best companies of the world",
};

type paramsProps = {
  params: { profile: string };
};

const Profile = async ({ params }: paramsProps) => {
  const { profile } = params;

  const session = await getAuthSession();

  const client = getClient();
  const { data, loading } = await client.query({
    query: GET_USER_PROFILE,
    variables: { userName: profile },
  });

  if (!data.getUserByUsername)
    return (
      <>
        <div className="font-heading flex flex-col items-center gap-2 p-2">
          <Image
            alt="img"
            src="/images/avatar/avatar.png"
            width={120}
            height={120}
            className="rounded-full"
          />
          <h6>@{profile}</h6>
          <h4>This account doesn’t exist</h4>
          <h6 className="font-sans">Try searching for another.</h6>
        </div>
        <Separator />
      </>
    );

  return (
    <>
      <div className="flex w-11/12 flex-col items-center gap-2 p-2">
        <Image
          alt="img"
          src={data.getUserByUsername.image ?? "/images/avatar/avatar.png"}
          width={120}
          height={120}
          className="cursor-pointer rounded-full"
        />
        <p>@{data.getUserByUsername.userName}</p>
        <p className="text-center text-sm md:text-lg">{data.getUserByUsername.name}</p>
        <div className="flex gap-3">
          <Mail />
          <span>{data.getUserByUsername.email}</span>•<MapPin />
          <span>Kolkata</span>•<p>{fromNow(data.getUserByUsername.createdAt)}</p>
        </div>
        {session?.user.id === data?.getUserByUsername.id && (
          <Link
            href="/settings/profile"
            className={cn(
              "focus-visible:ring-ring ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-lg  px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            )}>
            Edit Profile
          </Link>
        )}
      </div>
      <Separator />
      {data?.getUserByUsername.post.map((data) => (
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
              <MultipleButtons />
              <ApplyDialog
                myObject={data.accept}
                postID={data.id}
                stars={data.stars}
                totalApplied={data.totalApplied}
                acceptLimit={data.acceptLimit}
                expired={data.expiresAt}
              />
            </PostCard.Footer>
          </PostCard.Content>
        </PostCard>
      ))}
    </>
  );
};

export default Profile;
