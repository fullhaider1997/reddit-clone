import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  console.log(body);
  //data is loading
  if (fetching) {
    //user not logged in
  } else if (!data?.me) {
    console.log("here");
    console.log(data);
    body = (
      <>
        <NextLink href="login">
          <Link mr={4}> Login</Link>
        </NextLink>

        <NextLink href="register">
          <Link mr={4}> Register</Link>
        </NextLink>
      </>
    );

    //user is logged in
  } else {
    body = (
      <>
        <Flex>
          <Box p={4}>{data.me.username}</Box>
          <Button
            onClick={() => {
              logout();
            }}
            isLoading={logoutFetching}
            variant="link"
            fontSize={"2xl"}
          >
            {" "}
            Logout
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box bg="tomato" p={4} ml={"auto"} fontSize={"2xl"}>
        {body}
      </Box>
    </Flex>
  );
};
