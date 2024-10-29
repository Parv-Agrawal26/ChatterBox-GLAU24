import React from "react";

const UserList = ({ users, selectedUser, selectUser }) => {
  return (
    <div className="user-list">
      <h2>Chat with whom?</h2>
      <ul>
        {users.map((u) => (
          <li
            key={u._id}
            onClick={() => selectUser(u)}
            className={selectedUser?._id === u._id ? "selected" : ""}
          >
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
