import { gql } from "@apollo/client";

export const ADD_CAR = gql`
  mutation AddCar($input: CarInput!) {
    addCar(input: $input)
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar($input: CarInput!, $id: Int!) {
    updateCar(input: $input, carId: $id)
  }
`;
