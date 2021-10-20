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
