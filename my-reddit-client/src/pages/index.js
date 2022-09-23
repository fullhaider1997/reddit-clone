"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NavBar_1 = require("../components/NavBar");
const next_urql_1 = require("next-urql");
const createUrqlClient_1 = require("../../utils/createUrqlClient");
const graphql_1 = require("../generated/graphql");
const Index = () => {
    const [{ data }] = (0, graphql_1.usePostsQuery)();
    return (<>
      <NavBar_1.NavBar />
      <div> home</div>
      <br></br>
      {!data ? (<div>loading..</div>) : (data.posts.map((p) => <div key={p._id}>{p.title}</div>))}
    </>);
};
exports.default = (0, next_urql_1.withUrqlClient)(createUrqlClient_1.createUrqlClient, { ssr: true })(Index);
