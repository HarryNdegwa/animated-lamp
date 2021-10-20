import { gql } from "@apollo/client";

export const login = gql`
  query Login {
    login(input: { username: "luke", password: "testuser" }) {
      token
    }
  }
`;
