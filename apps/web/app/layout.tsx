import { ReactNode } from "react";

import "../styles/globals.css";

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  // const token = cookies().get("next-auth.session-token")?.value;

  // console.log("🚀🚀🚀🚀🚀🚀🚀", token);

  // const sessionId = cloakSSROnlySecret(token ?? "", "SECRET_KEY");
  // console.log("🔥🔥🔥cloakSSROnlySecret🔥🔥🔥🔥🔥", sessionId);
  return (
    <>
      {/* <ApolloWrapper sessionId={sessionId}>{ */}
      {children}
      {/* </ApolloWrapper> */}
    </>
  );
}
