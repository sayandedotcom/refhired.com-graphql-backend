// "use client";

// import {
//   ApolloLink, // createHttpLink
//   HttpLink,
// } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
// import {
//   ApolloNextAppProvider,
//   NextSSRApolloClient,
//   NextSSRInMemoryCache,
//   SSRMultipartLink,
// } from "@apollo/experimental-nextjs-app-support/ssr";
// import { getCookie } from "cookies-next";

// function makeClient() {
//   const httpLink = new HttpLink({
//     uri: "http://localhost:8000/graphql",
//     credentials: "include",
//     fetchOptions: { cache: "no-store" },
//   });

//   const authLink = setContext((_, { headers }) => {
//     const token = getCookie("__Secure-next-auth.session-token") ?? getCookie("next-auth.session-token");

//     return {
//       headers: {
//         ...headers,
//         authorization: token ? `Bearer ${token}` : "",
//       },
//     };
//   });

//   return new NextSSRApolloClient({
//     cache: new NextSSRInMemoryCache(),
//     link:
//       typeof window === "undefined"
//         ? ApolloLink.from([
//             new SSRMultipartLink({
//               stripDefer: true,
//             }),
//             authLink.concat(httpLink),
//           ])
//         : authLink.concat(httpLink),
//     defaultOptions: {
//       query: {
//         errorPolicy: "all",
//       },
//       mutate: {
//         errorPolicy: "all",
//       },
//     },
//   });
// }

// export function ApolloWrapper({ children }: React.PropsWithChildren) {
//   return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
// }

// function makeClient() {
//   const httpLink = new HttpLink({
//     uri: "http://localhost:8000/graphql",
//     credentials: "include",
//     fetchOptions: { cache: "no-store" },
//   });

//   return new NextSSRApolloClient({
//     cache: new NextSSRInMemoryCache(),
//     link:
//       typeof window === "undefined"
//         ? ApolloLink.from([
//             new SSRMultipartLink({
//               stripDefer: true,
//             }),
//             httpLink,
//           ])
//         : httpLink,
//   });
// }

export interface Data {
  id: string;
  post: Post;
  status: "read" | "unread";
  email: string;
}

interface Post {
  id: string;
  description: string;
  stars: number;
  appliedInfo: AppliedInfo[];
}

interface AppliedInfo {
  applyInfo: ApplyInfo;
  appliedAt: number;
  user: User;
}

interface ApplyInfo {
  pdfs: string;
  links: string;
  message: string;
}

interface User {
  email: string;
}

const ans = [
  {
    id: "clv4vxo0b0001goc6qd2mn0b4",
    description:
      "We are hiring full-stack developers urgently! \nFull-stack developers are responsible for both front-end and back-end development, meaning they work on all aspects of a web application. This includes designing user interfaces, implementing functionality, and managing databases.",
    stars: 0,
    appliedInfo: [
      {
        applyInfo: {
          pdfs: [
            {
              resume: "https://www.linkedin.com/in/sayande/",
            },
          ],
          links: [
            {
              linkedin: "https://www.linkedin.com/in/sayande/",
            },
            {
              github: "https://github.com/sayandedotcom",
            },
            {
              portfolio: "https://www.sayande.com/",
            },
          ],
          message: "Hi, I am excited to join your team !",
        },
        appliedAt: "2024-04-18T20:34:30.705Z",
        userId: "cluy7vm6t0000go3v3lwwzt0z",
        user: {
          email: "chumkimahajandey@gmail.com",
        },
      },
      {
        applyInfo: {
          pdfs: [
            {
              resume: "https://www.linkedin.com/in/sayande/",
            },
          ],
          links: [
            {
              linkedin: "https://www.linkedin.com/in/sayande/",
            },
            {
              github: "https://github.com/sayandedotcom",
            },
            {
              portfolio: "https://www.sayande.com/",
            },
          ],
          message: "Hi, I am Anirban.. please hire me I want to work in a high-growth startup",
        },
        appliedAt: "2024-04-19T19:07:07.063Z",
        userId: "clv71jsmr0000goewuelb8655",
        user: {
          email: "junkemail201510@gmail.com",
        },
      },
    ],
  },
  {
    id: "2",
    description: "We are hiring back-stack developers urgently!",
    stars: 10,
    appliedInfo: [
      {
        applyInfo: {
          pdfs: [
            {
              resume: "https://www.linkedin.com/in/sayande/",
            },
          ],
          links: [
            {
              linkedin: "https://www.linkedin.com/in/sayande/",
            },
            {
              github: "https://github.com/sayandedotcom",
            },
            {
              portfolio: "https://www.sayande.com/",
            },
          ],
          message: "Hi, I am excited to join your team !",
        },
        appliedAt: "2024-04-18T20:34:30.705Z",
        userId: "cluy7vm6t0000go3v3lwwzt0z",
        user: {
          email: "chumkimahajandey@gmail.com",
        },
      },
      {
        applyInfo: {
          pdfs: [
            {
              resume: "https://www.linkedin.com/in/sayande/",
            },
          ],
          links: [
            {
              linkedin: "https://www.linkedin.com/in/sayande/",
            },
            {
              github: "https://github.com/sayandedotcom",
            },
            {
              portfolio: "https://www.sayande.com/",
            },
          ],
          message: "Hi, I am Anirban.. please hire me I want to work in a high-growth startup",
        },
        appliedAt: "2024-04-19T19:07:07.063Z",
        userId: "clv71jsmr0000goewuelb8655",
        user: {
          email: "junkemail201510@gmail.com",
        },
      },
    ],
  },
];
