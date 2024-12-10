export const queries = `#graphql
    getAllPosts(userId: String): [Post]
    getPostBySlug(id: String!): Post
    getAllApplied(id: String!): [AllApplied]
    getAllRequests(id: String!): AllRequests
    getAllBookmarkedPosts: [Post]
    getSignedURLForPost(imageName: String!, imageType: String!): String
    getTodos(id:ID): ReturnedTodo
    test(id:ID): TodoResult
`;
