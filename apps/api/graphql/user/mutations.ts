export const mutations = `#graphql
    addToWaitlist(email: String): User
    getSessionUser: User
    verifyGoogleAuthToken(googleToken: String!): String
`;
