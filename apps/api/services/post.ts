import prisma from "@referrer/prisma";
import redis from "@referrer/redis";

import RateLimitError from "../errors/RateLimitError.js";
import {
  Id,
  commentText,
  createApplyPost,
  createFindReferralPost,
  createPost,
  createReferralPost,
} from "../graphql/posts/interfaces.js";
import { cacheTime, rateLimitMaxActionsAllowed, rateLimitTimeInSeconds } from "../utils/index.js";

class PostService {
  public static async getAllPosts(userId?: Id) {
    if (userId) {
      const cachedAllPostsByUser = await redis.get(`USER:POSTS:${userId}`);
      if (cachedAllPostsByUser) return JSON.parse(cachedAllPostsByUser);
      const user = await prisma.posts.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      await redis.set(`USER:POSTS:${userId}`, JSON.stringify(user), "EX", cacheTime);
      return user;
    } else {
      const cachedAllPosts = await redis.get("ALL_POSTS");
      if (cachedAllPosts) return JSON.parse(cachedAllPosts);
      const posts = await prisma.posts.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      await redis.set("ALL_POSTS", JSON.stringify(posts));
      return posts;
    }
  }

  public static async getAllPostsWithApplied(id: Id) {
    const cachedAllPostsWithApplied = await redis.get(`POST:WITH_APPLIED:${id}`);
    if (cachedAllPostsWithApplied) return JSON.parse(cachedAllPostsWithApplied);
    const posts = await prisma.posts.findMany({
      where: {
        userId: id,
        NOT: {
          totalApplied: {
            equals: 0,
          },
        },
      },
    });
    await redis.set(`POST:WITH_APPLIED:${id}`, JSON.stringify(posts), "EX", cacheTime);
    return posts;
  }

  public static async getAllTags(id: Id) {
    const cachedAllTags = await redis.get(`POST:TAGS:${id}`);
    if (cachedAllTags) return JSON.parse(cachedAllTags);
    const tags = await prisma.posts.findMany({
      where: { id },
      select: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    });
    await redis.set(`POST:TAGS:${id}`, JSON.stringify(tags[0].tags), "EX", cacheTime);
    return tags[0].tags;
  }

  public static async getPostBySlug(id: Id) {
    const cachedPostBySlug = await redis.get(`POST:ID:${id}`);
    if (cachedPostBySlug) return JSON.parse(cachedPostBySlug);
    const post = await prisma.posts.findFirst({
      where: {
        id,
      },
    });
    await redis.set(`POST:ID:${id}`, JSON.stringify(post), "EX", cacheTime);
    return post;
  }

  public static async getAllApplied(userId: Id) {
    const ans = await prisma.applied.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        appliedAt: true,
        applyInfo: true,
        postId: true,
      },
    });
    console.log(ans);

    // const applied = await prisma.applied.findMany()

    return ans;
  }

  public static async getAllRequests(userId: Id) {
    const cachedAllRequests = await redis.get(`USER:REQUESTS:${userId}`);
    if (cachedAllRequests) return JSON.parse(cachedAllRequests);
    const requests = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        posts: {
          select: {
            id: true,
            userId: true,
            description: true,
            stars: true,
          },
        },
      },
    });
    await redis.set(`USER:REQUESTS:${userId}`, JSON.stringify(requests), "EX", cacheTime);
    return requests;
  }

  public static async applyInfo(id: Id) {
    const cachedApplyInfo = await redis.get(`POST:APPLY_INFO:${id}`);
    if (cachedApplyInfo) return JSON.parse(cachedApplyInfo);
    const info = await prisma.applied.findMany({
      where: {
        postId: id,
      },
      select: {
        userId: true,
        applyInfo: true,
        appliedAt: true,
      },
    });
    await redis.set(`POST:APPLY_INFO:${id}`, JSON.stringify(info), "EX", cacheTime);
    return info;
  }

  public static async getAllBookmarkedPosts(userId: Id) {
    const cachedAllBookmarkedPosts = await redis.get(`USER:BOOKMARKS:${userId}`);
    if (cachedAllBookmarkedPosts) return JSON.parse(cachedAllBookmarkedPosts);
    const post = await prisma.bookmarks.findMany({
      where: {
        userId: userId,
      },
    });
    await redis.set(`USER:BOOKMARKS:${userId}`, JSON.stringify(post), "EX", cacheTime);
    return post;
  }

  public static async createPost(info: createPost) {
    const key = `RATE_LIMIT:POST:${info.userId}`;
    const currentCount = await redis.incr(key);

    if (currentCount === 1) {
      // If the key was just created, set its expiration time
      await redis.expire(key, rateLimitTimeInSeconds);
    }

    if (currentCount > rateLimitMaxActionsAllowed) {
      // If the user has exceeded the maximum allowed posts, return false
      throw new RateLimitError("Please Wait");
    }

    const post = await prisma.posts.create({
      data: {
        userId: info.userId,
        description: info.description,
        postType: "POST",
        hashtags: {
          connectOrCreate: info.hashtags.map((hashtag) => ({
            where: {
              name: hashtag,
            },
            create: {
              name: hashtag,
            },
          })),
        },
      },
    });

    return post;
  }

  public static async createReferralPost(info: createReferralPost) {
    const rateLimitFlag = await redis.get(`RATE_LIMIT:POST:${info.userId}`);
    if (rateLimitFlag) throw new RateLimitError("Please Wait");
    const createdPost = await prisma.posts.create({
      data: {
        userId: info.userId,
        description: info.description,
        accept: info.accept,
        expiresAt: info.expiresAt,
        jobRole: info.jobRole,
        jobType: info.jobType,
        jobExperience: info.jobExperience,
        jobLocation: info.jobLocation,
        jobCode: info.jobCode,
        companyName: info.companyName,
        stars: info.stars,
        acceptLimit: info.acceptLimit,
        jobCompensation: info.jobCompensation,
        postType: "REFERRALPOST",
        tags: {
          connectOrCreate: info.tags?.map((tag) => ({
            where: {
              name: tag,
            },
            create: {
              name: tag,
            },
          })),
        },
        hashtags: {
          connectOrCreate: info.hashtags?.map((hashtag) => ({
            where: {
              name: hashtag,
            },
            create: {
              name: hashtag,
            },
          })),
        },
      },
    });
    await redis.set(`RATE_LIMIT:POST:${info.userId}`, 1, "EX", rateLimitTimeInSeconds);
    await redis.del("ALL_POSTS");
    return createdPost;
  }

  public static async createFindReferralPost(info: createFindReferralPost) {
    await prisma.posts.create({
      data: {
        userId: info.userId,
        description: info.description,
        accept: info.accept,
        expiresAt: info.expiresAt,
        jobRole: info.jobRole,
        jobType: info.jobType,
        jobExperience: info.jobExperience,
        jobLocation: info.jobLocation,
        jobCode: info.jobCode,
        companyName: info.companyName,
        stars: info.stars,
        acceptLimit: info.acceptLimit,
        postType: "FINDREFERRER",
        tags: {
          connectOrCreate: info?.tags.map((tag) => ({
            where: {
              name: tag,
            },
            create: {
              name: tag,
            },
          })),
        },
        // hashtags: {
        //   connectOrCreate: info?.hashtags.map((hashtag) => ({
        //     where: {
        //       name: hashtag,
        //     },
        //     create: {
        //       name: hashtag,
        //     },
        //   })),
        // },
      },
    });
  }

  public static async deletePost(postId: Id) {
    await prisma.posts.delete({
      where: {
        id: postId,
      },
    });
  }

  public static async bookmarkPost(postId: Id, userId: Id) {
    await prisma.bookmarks.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }

  public static async applyPost(payload: createApplyPost) {
    const applied = await prisma.applied.create({
      data: {
        userId: payload.userId,
        postId: payload.postId,
        applyInfo: payload.applyInfo,
      },
    });
    await prisma.posts.update({
      where: { id: payload.postId },
      data: {
        totalApplied: {
          increment: 1,
        },
      },
    });
    return applied;
  }

  public static async commentOnPost(postId: Id, userId: Id, commentText: commentText) {
    await prisma.comments.create({
      data: {
        userId: userId,
        postId: postId,
        text: commentText,
      },
    });
  }
}

export default PostService;
