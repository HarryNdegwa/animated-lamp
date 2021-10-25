import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars {
    cars {
      id
      name
      make
      model
      images
      location
      year
    }
  }
`;

export const GET_CAR = gql`
  query GetCar($id: ID!) {
    car(id: $id) {
      id
      name
      make
      model
      images
      location
      year
      owner {
        username
      }
    }
    # me {
    #   username
    # }
  }
`;
