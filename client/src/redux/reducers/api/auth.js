import axios from "../../../axiosConfig";
import { authConfig } from "../../utilities/authConfig";
import { setQid } from "../auth";

export const register = (data) => async (dispatch) => {
  try {
    const response = await axios.post("/v1/register", data);

    if (response.status === 200) {
      dispatch(setQid(response.data.token));
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status >= 400 && status < 500) {
        return data;
      } else {
        console.log(`error`, error);
      }
    }
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const response = await axios.post("/v1/login", data);

    if (response.status === 200) {
      dispatch(setQid(response.data.token));
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status >= 400 && status < 500) {
        return data;
      } else {
        console.log(`error`, error);
      }
    }
  }
};

export const getMe = () => async (_, getState) => {
  try {
    const token = getState().auth.qid;

    let config = authConfig(token);

    const response = await axios.get("/v1/me", {
      headers: { ...config },
    });

    return response.data;
  } catch (error) {
    console.log(`error`, error.message);
  }
};

export const getUser = (id) => async (_, getState) => {
  try {
    // const token = getState().auth.qid;

    const response = await axios.get(`/v1/user/${id}`);

    return response.data;
  } catch (error) {
    console.log(`error`, error.message);
  }
};

export const getNewChatUsers = () => async (_, getState) => {
  try {
    const token = getState().auth.qid;

    let config = authConfig(token);

    const response = await axios.get("/v1/get-new-chat-users", {
      headers: { ...config },
    });

    return response.data;
  } catch (error) {
    console.log(`error`, error.message);
  }
};

export const getChatUsers = () => async (_, getState) => {
  try {
    const token = getState().auth.qid;

    let config = authConfig(token);

    const response = await axios.get("/v1/get-chat-users", {
      headers: { ...config },
    });

    return response.data;
  } catch (error) {
    console.log(`error`, error.message);
  }
};

export const createNewChat = (id) => async (_, getState) => {
  try {
    const token = getState().auth.qid;

    let config = authConfig(token);

    const response = await axios.post(
      `/v1/create-new-chat/${id}`,
      {},
      {
        headers: { ...config },
      }
    );

    console.log(`response`, response);

    return response.data;
  } catch (error) {
    console.log(`error`, error.message);
  }
};
