import PostService from "../../services/post.js";
import UserService from "../../services/user.js";

const queries = {
  getUserByUsername: async (_, args: { userName: string }) => {
    return await UserService.getUserByUsername(args.userName);
  },
};
const mutations = {
  addToWaitlist: async (_, args: { email: string }) => {
    return await UserService.addToWaitlist(args.email);
  },
};
const extraResolvers = {
  User: {
    post: async (args) => await PostService.getAllPosts(args.id),
  },
};

export const resolvers = { queries, mutations, extraResolvers };
