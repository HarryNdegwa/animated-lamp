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
  query GetCar($id: Int!) {
    car(id: $id) {
      id
      name
      make
      model
      images
      location
      year
      UserId
      owner {
        username
        id
      }
      me {
        id
        username
      }
    }
  }
`;

export const GET_UPDATE_CAR = gql`
  query GetUpdateCar($id: Int!) {
    car(id: $id) {
      # id
      name
      make
      model
      images
      location
      year
    }
  }
`;
