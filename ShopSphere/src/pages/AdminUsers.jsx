import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function AdminUsers() {
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const updateRole = async (userId, role) => {
    try {
      setUpdatingId(userId);
      setError("");

      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUsers();
    } catch (error) {
      console.error("UPDATE ROLE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-gray-500">
          Loading users...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="text-4xl font-bold">
        User Management
      </h1>

      <p className="mt-2 text-gray-500">
        View and manage registered ShopSphere users
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  #
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Mobile
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Joined
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y">

              {users.map((user, index) => {

                const isCurrentUser =
                  user._id === currentUser?.id ||
                  user._id === currentUser?._id;

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.mobile}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-6 py-4">

                      {isCurrentUser ? (
                        <span className="text-sm text-gray-400">
                          Current Account
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          disabled={updatingId === user._id}
                          onChange={(e) =>
                            updateRole(
                              user._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm"
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {users.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No users found.
          </div>
        )}

      </div>

    </main>
  );
}

export default AdminUsers;