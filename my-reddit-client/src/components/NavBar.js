"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavBar = void 0;
const { Button } = require("@chakra-ui/react");
const react_1 = require("@chakra-ui/react");
const link_1 = __importDefault(require("next/link"));
const graphql_1 = require("../generated/graphql");
const NavBar = ({}) => {
  const [{ fetching: logoutFetching }, logout] = (0,
  graphql_1.useLogoutMutation)();
  const [{ data, fetching }] = (0, graphql_1.useMeQuery)();
  let body = null;
  console.log(body);
  //data is loading
  if (fetching) {
    //user not logged in
  } else if (!(data === null || data === void 0 ? void 0 : data.me)) {
    console.log("here");
    console.log(data);
    body = (
      <>
        <link_1.default href="login">
          <react_1.Link mr={1100} fontFamily={"sans-serif"} color={"teal"}>
            {" "}
            My reddit{" "}
          </react_1.Link>
        </link_1.default>
        <link_1.default href="login">
          <Button colorScheme="teal" variant="solid" size="md">
            <react_1.Link mr={2}> Login </react_1.Link>
          </Button>
        </link_1.default>
        <Button mr={3} visibility="hidden"></Button>
        <link_1.default href="register">
          <Button colorScheme="teal" variant="solid" size="md">
            <react_1.Link mr={2}> Register </react_1.Link>
          </Button>
        </link_1.default>
      </>
    );
    //user is logged in
  } else {
    body = (
      <>
        <react_1.Flex>
          <react_1.Box p={4}>{data.me.username}</react_1.Box>
          <react_1.Button
            onClick={() => {
              logout();
            }}
            isLoading={logoutFetching}
            variant="link"
            fontSize={"2xl"}
          >
            {" "}
            Logout
          </react_1.Button>
        </react_1.Flex>
      </>
    );
  }
  return (
    <react_1.Flex bg="tomato" p={4}>
      <react_1.Box bg="tomato" p={4} ml={"auto"} fontSize={"2xl"}>
        {body}
      </react_1.Box>
    </react_1.Flex>
  );
};
exports.NavBar = NavBar;
