// import { getObjectUrl } from "@refhiredcom/bucket";
import BucketService from "../../services/bucket.js";
import { GraphqlContext } from "../interfaces.js";
import { SignUrlInfo } from "./interfaces.js";

const queries = {
  getSignUrl: async (parent, args: { payload: SignUrlInfo }, ctx: GraphqlContext, info) => {
    // return `${args.payload.key}-----${args.payload.contentType}`;
    if (args.payload.contentType)
      return await BucketService.putObject(args.payload.key, args.payload.contentType);
    else return await BucketService.getObject(args.payload.key);
  },
};
const mutations = {};
const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
