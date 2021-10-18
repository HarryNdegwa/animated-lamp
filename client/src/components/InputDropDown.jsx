import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createNewChat } from "../redux/reducers/api/auth";

export default function InputDropDown({
  data,
  setData,
  setChatUsers,
  chatUsers,
  disable,
  placeholder,
}) {
  const [showDropDown, setShowDropDown] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setShowDropDown(true);
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search === "") {
      setShowDropDown(false);
    }
  }, [search]);

  const handleAddNewChatUser = async (e, id) => {
    setSearch("");
    setLoading(true);

    const response = await dispatch(createNewChat(id));

    if (response) {
      setChatUsers([response, ...chatUsers]);
      let tempData = data.filter((d) => d.id !== id);
      setData([...tempData]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-input-dropdown-wrapper">
      <input
        type="text"
        className="form-control"
        id="username"
        required
        values={search}
        onChange={handleChange}
        name="username"
        placeholder={placeholder}
        disabled={disable}
      />
      {showDropDown && (
        <div className="custom-input-dropdown shadow">
          {data &&
            data
              .filter((d) => {
                return d.username.includes(search.toLowerCase());
              })
              .map((obj) => (
                <div
                  className="p-3 cursor-pointer"
                  key={obj.id}
                  onClick={(e) => handleAddNewChatUser(e, obj.id)}
                >
                  <p className="m-0">{obj.username}</p>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
