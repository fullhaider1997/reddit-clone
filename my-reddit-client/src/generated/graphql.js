"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePostsQuery = exports.PostsDocument = exports.useMeQuery = exports.MeDocument = exports.useRegisterMutation = exports.RegisterDocument = exports.useLogoutMutation = exports.LogoutDocument = exports.useLoginMutation = exports.LoginDocument = exports.useChangePasswordMutation = exports.ChangePasswordDocument = exports.RegularUserResponseFragmentDoc = exports.RegularErrorFragmentDoc = exports.RegularUserFragmentDoc = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const Urql = __importStar(require("urql"));
exports.RegularUserFragmentDoc = (0, graphql_tag_1.default) `
    fragment RegularUser on User {
  _id
  username
}
    `;
exports.RegularErrorFragmentDoc = (0, graphql_tag_1.default) `
    fragment RegularError on FieldError {
  field
  message
}
    `;
exports.RegularUserResponseFragmentDoc = (0, graphql_tag_1.default) `
    fragment RegularUserResponse on UserResponse {
  user {
    ...RegularUser
  }
  errors {
    ...RegularError
  }
}
    ${exports.RegularUserFragmentDoc}
${exports.RegularErrorFragmentDoc}`;
exports.ChangePasswordDocument = (0, graphql_tag_1.default) `
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${exports.RegularUserResponseFragmentDoc}`;
function useChangePasswordMutation() {
    return Urql.useMutation(exports.ChangePasswordDocument);
}
exports.useChangePasswordMutation = useChangePasswordMutation;
;
exports.LoginDocument = (0, graphql_tag_1.default) `
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${exports.RegularUserResponseFragmentDoc}`;
function useLoginMutation() {
    return Urql.useMutation(exports.LoginDocument);
}
exports.useLoginMutation = useLoginMutation;
;
exports.LogoutDocument = (0, graphql_tag_1.default) `
    mutation Logout {
  logout
}
    `;
function useLogoutMutation() {
    return Urql.useMutation(exports.LogoutDocument);
}
exports.useLogoutMutation = useLogoutMutation;
;
exports.RegisterDocument = (0, graphql_tag_1.default) `
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${exports.RegularUserResponseFragmentDoc}`;
function useRegisterMutation() {
    return Urql.useMutation(exports.RegisterDocument);
}
exports.useRegisterMutation = useRegisterMutation;
;
exports.MeDocument = (0, graphql_tag_1.default) `
    query Me {
  me {
    ...RegularUser
  }
}
    ${exports.RegularUserFragmentDoc}`;
function useMeQuery(options) {
    return Urql.useQuery({ query: exports.MeDocument, ...options });
}
exports.useMeQuery = useMeQuery;
;
exports.PostsDocument = (0, graphql_tag_1.default) `
    query Posts {
  posts {
    _id
    createdAt
    updatedAt
    title
  }
}
    `;
function usePostsQuery(options) {
    return Urql.useQuery({ query: exports.PostsDocument, ...options });
}
exports.usePostsQuery = usePostsQuery;
;
