import { gql } from "@apollo/client";

export const ADD_CAR = gql`
  mutation AddCar($input: CarInput!) {
    addCar(input: $input)
  }
`;
